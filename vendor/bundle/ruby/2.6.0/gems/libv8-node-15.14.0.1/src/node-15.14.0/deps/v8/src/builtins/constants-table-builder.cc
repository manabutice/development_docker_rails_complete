// Copyright 2018 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "src/builtins/constants-table-builder.h"

#include "src/execution/isolate.h"
#include "src/heap/heap-inl.h"
#include "src/objects/oddball-inl.h"
#include "src/roots/roots-inl.h"

namespace v8 {
namespace internal {

BuiltinsConstantsTableBuilder::BuiltinsConstantsTableBuilder(Isolate* isolate)
    : isolate_(isolate), map_(isolate->heap()) {
  // Ensure this is only called once per Isolate.
  DCHECK_EQ(ReadOnlyRoots(isolate_).empty_fixed_array(),
            isolate_->heap()->builtins_constants_table());

  // And that the initial value of the builtins constants table can be treated
  // as a constant, which means that codegen will load it using the root
  // register.
  DCHECK(RootsTable::IsImmortalImmovable(RootIndex::kEmptyFixedArray));
}

uint32_t BuiltinsConstantsTableBuilder::AddObject(Handle<Object> object) {
#ifdef DEBUG
  // Roots must not be inserted into the constants table as they are already
  // accessibly from the root list.
  RootIndex root_list_index;
  DCHECK(!isolate_->roots_table().IsRootHandle(object, &root_list_index));

  // Not yet finalized.
  DCHECK_EQ(ReadOnlyRoots(isolate_).empty_fixed_array(),
            isolate_->heap()->builtins_constants_table());

  // Must be on the main thread.
  DCHECK_EQ(ThreadId::Current(), isolate_->thread_id());

  // Must be generating embedded builtin code.
  DCHECK(isolate_->IsGeneratingEmbeddedBuiltins());

  // All code objects should be loaded through the root register or use
  // pc-relative addressing.
  DCHECK(!object->IsCode());
#endif

  uint32_t* maybe_key = map_.Find(object);
  if (maybe_key == nullptr) {
    DCHECK(object->IsHeapObject());
    uint32_t index = map_.size();
    map_.Set(object, index);
    return index;
  } else {
    return *maybe_key;
  }
}

namespace {
void CheckPreconditionsForPatching(Isolate* isolate,
                                   Handle<Object> replacement_object) {
  // Roots must not be inserted into the constants table as they are already
  // accessible from the root list.
  RootIndex root_list_index;
  DCHECK(!isolate->roots_table().IsRootHandle(replacement_object,
                                              &root_list_index));
  USE(root_list_index);

  // Not yet finalized.
  DCHECK_EQ(ReadOnlyRoots(isolate).empty_fixed_array(),
            isolate->heap()->builtins_constants_table());

  DCHECK(isolate->IsGeneratingEmbeddedBuiltins());
}
}  // namespace

void BuiltinsConstantsTableBuilder::PatchSelfReference(
    Handle<Object> self_reference, Handle<Code> code_object) {
  CheckPreconditionsForPatching(isolate_, code_object);
  DCHECK(self_reference->IsOddball());
  DCHECK(Oddball::cast(*self_reference).kind() ==
         Oddball::kSelfReferenceMarker);

  uint32_t key;
  if (map_.Delete(self_reference, &key)) {
    DCHECK(code_object->IsCode());
    map_.Set(code_object, key);
  }
}

void BuiltinsConstantsTableBuilder::PatchBasicBlockCountersReference(
    Handle<ByteArray> counters) {
  CheckPreconditionsForPatching(isolate_, counters);

  uint32_t key;
  if (map_.Delete(ReadOnlyRoots(isolate_).basic_block_counters_marker(),
                  &key)) {
    map_.Set(counters, key);
  }
}

void BuiltinsConstantsTableBuilder::Finalize() {
  HandleScope handle_scope(isolate_);

  DCHECK_EQ(ReadOnlyRoots(isolate_).empty_fixed_array(),
            isolate_->heap()->builtins_constants_table());
  DCHECK(isolate_->IsGeneratingEmbeddedBuiltins());

  // An empty map means there's nothing to do.
  if (map_.size() == 0) return;

  Handle<FixedArray> table =
      isolate_->factory()->NewFixedArray(map_.size(), AllocationType::kOld);

  Builtins* builtins = isolate_->builtins();
  ConstantsMap::IteratableScope it_scope(&map_);
  for (auto it = it_scope.begin(); it != it_scope.end(); ++it) {
    uint32_t index = *it.entry();
    Object value = it.key();
    if (value.IsCode() && Code::cast(value).kind() == CodeKind::BUILTIN) {
      // Replace placeholder code objects with the real builtin.
      // See also: SetupIsolateDelegate::PopulateWithPlaceholders.
      // TODO(jgruber): Deduplicate placeholders and their corresponding
      // builtin.
      value = builtins->builtin(Code::cast(value).builtin_index());
    }
    DCHECK(value.IsHeapObject());
    table->set(index, value);
  }

#ifdef DEBUG
  for (int i = 0; i < map_.size(); i++) {
    DCHECK(table->get(i).IsHeapObject());
    DCHECK_NE(ReadOnlyRoots(isolate_).undefined_value(), table->get(i));
    DCHECK_NE(ReadOnlyRoots(isolate_).self_reference_marker(), table->get(i));
    DCHECK_NE(ReadOnlyRoots(isolate_).basic_block_counters_marker(),
              table->get(i));
  }
#endif

  isolate_->heap()->SetBuiltinsConstantsTable(*table);
}

}  // namespace internal
}  // namespace v8
