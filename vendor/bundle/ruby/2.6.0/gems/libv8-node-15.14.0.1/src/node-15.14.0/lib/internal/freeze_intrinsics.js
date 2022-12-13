// Adapted from SES/Caja - Copyright (C) 2011 Google Inc.
// Copyright (C) 2018 Agoric

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// SPDX-License-Identifier: Apache-2.0

// Based upon:
// https://github.com/google/caja/blob/master/src/com/google/caja/ses/startSES.js
// https://github.com/google/caja/blob/master/src/com/google/caja/ses/repairES5.js
// https://github.com/tc39/proposal-ses/blob/e5271cc42a257a05dcae2fd94713ed2f46c08620/shim/src/freeze.js

/* global WebAssembly, SharedArrayBuffer, console */
'use strict';

const {
  Array,
  ArrayBuffer,
  ArrayBufferPrototype,
  ArrayPrototype,
  ArrayPrototypeForEach,
  ArrayPrototypePush,
  BigInt,
  BigInt64Array,
  BigInt64ArrayPrototype,
  BigIntPrototype,
  BigUint64Array,
  BigUint64ArrayPrototype,
  Boolean,
  BooleanPrototype,
  DataView,
  DataViewPrototype,
  Date,
  DatePrototype,
  Error,
  ErrorPrototype,
  EvalError,
  EvalErrorPrototype,
  Float32Array,
  Float32ArrayPrototype,
  Float64Array,
  Float64ArrayPrototype,
  Function,
  FunctionPrototype,
  Int16Array,
  Int16ArrayPrototype,
  Int32Array,
  Int32ArrayPrototype,
  Int8Array,
  Int8ArrayPrototype,
  Map,
  MapPrototype,
  Number,
  NumberPrototype,
  Object,
  ObjectDefineProperty,
  ObjectFreeze,
  ObjectGetOwnPropertyDescriptor,
  ObjectGetOwnPropertyDescriptors,
  ObjectGetOwnPropertyNames,
  ObjectGetOwnPropertySymbols,
  ObjectGetPrototypeOf,
  ObjectPrototype,
  ObjectPrototypeHasOwnProperty,
  Promise,
  PromisePrototype,
  RangeError,
  RangeErrorPrototype,
  ReferenceError,
  ReferenceErrorPrototype,
  ReflectOwnKeys,
  RegExp,
  RegExpPrototype,
  SafeSet,
  Set,
  SetPrototype,
  String,
  StringPrototype,
  Symbol,
  SymbolIterator,
  SyntaxError,
  SyntaxErrorPrototype,
  TypeError,
  TypeErrorPrototype,
  TypedArray,
  TypedArrayPrototype,
  Uint16Array,
  Uint16ArrayPrototype,
  Uint32Array,
  Uint32ArrayPrototype,
  Uint8Array,
  Uint8ArrayPrototype,
  Uint8ClampedArray,
  Uint8ClampedArrayPrototype,
  URIError,
  URIErrorPrototype,
  WeakMap,
  WeakMapPrototype,
  WeakSet,
  WeakSetPrototype,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
} = primordials;

module.exports = function() {
  const {
    clearImmediate,
    clearInterval,
    clearTimeout,
    setImmediate,
    setInterval,
    setTimeout
  } = require('timers');

  const intrinsicPrototypes = [
    // Anonymous Intrinsics
    // IteratorPrototype
    ObjectGetPrototypeOf(
      ObjectGetPrototypeOf(new Array()[SymbolIterator]())
    ),
    // ArrayIteratorPrototype
    ObjectGetPrototypeOf(new Array()[SymbolIterator]()),
    // StringIteratorPrototype
    ObjectGetPrototypeOf(new String()[SymbolIterator]()),
    // MapIteratorPrototype
    ObjectGetPrototypeOf(new Map()[SymbolIterator]()),
    // SetIteratorPrototype
    ObjectGetPrototypeOf(new Set()[SymbolIterator]()),
    // GeneratorFunction
    ObjectGetPrototypeOf(function* () {}),
    // AsyncFunction
    ObjectGetPrototypeOf(async function() {}),
    // AsyncGeneratorFunction
    ObjectGetPrototypeOf(async function* () {}),
    // TypedArray
    TypedArrayPrototype,

    // 19 Fundamental Objects
    ObjectPrototype, // 19.1
    FunctionPrototype, // 19.2
    BooleanPrototype, // 19.3

    ErrorPrototype, // 19.5
    EvalErrorPrototype,
    RangeErrorPrototype,
    ReferenceErrorPrototype,
    SyntaxErrorPrototype,
    TypeErrorPrototype,
    URIErrorPrototype,

    // 20 Numbers and Dates
    NumberPrototype, // 20.1
    DatePrototype, // 20.3

    // 21 Text Processing
    StringPrototype, // 21.1
    RegExpPrototype, // 21.2

    // 22 Indexed Collections
    ArrayPrototype, // 22.1

    Int8ArrayPrototype,
    Uint8ArrayPrototype,
    Uint8ClampedArrayPrototype,
    Int16ArrayPrototype,
    Uint16ArrayPrototype,
    Int32ArrayPrototype,
    Uint32ArrayPrototype,
    Float32ArrayPrototype,
    Float64ArrayPrototype,
    BigInt64ArrayPrototype,
    BigUint64ArrayPrototype,

    // 23 Keyed Collections
    MapPrototype, // 23.1
    SetPrototype, // 23.2
    WeakMapPrototype, // 23.3
    WeakSetPrototype, // 23.4

    // 24 Structured Data
    ArrayBufferPrototype, // 24.1
    DataViewPrototype, // 24.3
    PromisePrototype, // 25.4

    // Other APIs / Web Compatibility
    console.Console.prototype,
    BigIntPrototype,
    WebAssembly.Module.prototype,
    WebAssembly.Instance.prototype,
    WebAssembly.Table.prototype,
    WebAssembly.Memory.prototype,
    WebAssembly.CompileError.prototype,
    WebAssembly.LinkError.prototype,
    WebAssembly.RuntimeError.prototype,
    SharedArrayBuffer.prototype,
  ];
  const intrinsics = [
    // Anonymous Intrinsics
    // ThrowTypeError
    ObjectGetOwnPropertyDescriptor(FunctionPrototype, 'caller').get,
    // IteratorPrototype
    ObjectGetPrototypeOf(
      ObjectGetPrototypeOf(new Array()[SymbolIterator]())
    ),
    // ArrayIteratorPrototype
    ObjectGetPrototypeOf(new Array()[SymbolIterator]()),
    // StringIteratorPrototype
    ObjectGetPrototypeOf(new String()[SymbolIterator]()),
    // MapIteratorPrototype
    ObjectGetPrototypeOf(new Map()[SymbolIterator]()),
    // SetIteratorPrototype
    ObjectGetPrototypeOf(new Set()[SymbolIterator]()),
    // GeneratorFunction
    ObjectGetPrototypeOf(function* () {}),
    // AsyncFunction
    ObjectGetPrototypeOf(async function() {}),
    // AsyncGeneratorFunction
    ObjectGetPrototypeOf(async function* () {}),
    // TypedArray
    TypedArray,

    // 18 The Global Object
    eval,
    // eslint-disable-next-line node-core/prefer-primordials
    isFinite,
    // eslint-disable-next-line node-core/prefer-primordials
    isNaN,
    // eslint-disable-next-line node-core/prefer-primordials
    parseFloat,
    // eslint-disable-next-line node-core/prefer-primordials
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,

    // 19 Fundamental Objects
    Object, // 19.1
    Function, // 19.2
    Boolean, // 19.3
    Symbol, // 19.4

    Error, // 19.5
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,

    // 20 Numbers and Dates
    Number, // 20.1
    // eslint-disable-next-line node-core/prefer-primordials
    Math, // 20.2
    Date, // 20.3

    // 21 Text Processing
    String, // 21.1
    RegExp, // 21.2

    // 22 Indexed Collections
    Array, // 22.1

    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array,

    // 23 Keyed Collections
    Map, // 23.1
    Set, // 23.2
    WeakMap, // 23.3
    WeakSet, // 23.4

    // 24 Structured Data
    ArrayBuffer, // 24.1
    DataView, // 24.3
    // eslint-disable-next-line node-core/prefer-primordials
    JSON, // 24.5
    Promise, // 25.4

    // 26 Reflection
    // eslint-disable-next-line node-core/prefer-primordials
    Reflect, // 26.1
    Proxy, // 26.2

    // B.2.1
    escape,
    unescape,

    // Other APIs / Web Compatibility
    clearImmediate,
    clearInterval,
    clearTimeout,
    setImmediate,
    setInterval,
    setTimeout,
    console,
    BigInt,
    Atomics,
    WebAssembly,
    SharedArrayBuffer,
  ];

  if (typeof Intl !== 'undefined') {
    ArrayPrototypePush(intrinsicPrototypes,
                       Intl.Collator.prototype,
                       Intl.DateTimeFormat.prototype,
                       Intl.ListFormat.prototype,
                       Intl.NumberFormat.prototype,
                       Intl.PluralRules.prototype,
                       Intl.RelativeTimeFormat.prototype,
    );
    ArrayPrototypePush(intrinsics, Intl);
  }

  ArrayPrototypeForEach(intrinsicPrototypes, enableDerivedOverrides);

  const frozenSet = new WeakSet();
  ArrayPrototypeForEach(intrinsics, deepFreeze);

  // Objects that are deeply frozen.
  function deepFreeze(root) {
    /**
     * "innerDeepFreeze()" acts like "Object.freeze()", except that:
     *
     * To deepFreeze an object is to freeze it and all objects transitively
     * reachable from it via transitive reflective property and prototype
     * traversal.
     */
    function innerDeepFreeze(node) {
      // Objects that we have frozen in this round.
      const freezingSet = new SafeSet();

      // If val is something we should be freezing but aren't yet,
      // add it to freezingSet.
      function enqueue(val) {
        if (Object(val) !== val) {
          // ignore primitives
          return;
        }
        const type = typeof val;
        if (type !== 'object' && type !== 'function') {
          // NB: handle for any new cases in future
        }
        if (frozenSet.has(val) || freezingSet.has(val)) {
          // TODO: Use uncurried form
          // Ignore if already frozen or freezing
          return;
        }
        freezingSet.add(val); // TODO: Use uncurried form
      }

      function doFreeze(obj) {
        // Immediately freeze the object to ensure reactive
        // objects such as proxies won't add properties
        // during traversal, before they get frozen.

        // Object are verified before being enqueued,
        // therefore this is a valid candidate.
        // Throws if this fails (strict mode).
        ObjectFreeze(obj);

        // We rely upon certain commitments of Object.freeze and proxies here

        // Get stable/immutable outbound links before a Proxy has a chance to do
        // something sneaky.
        const proto = ObjectGetPrototypeOf(obj);
        const descs = ObjectGetOwnPropertyDescriptors(obj);
        enqueue(proto);
        ArrayPrototypeForEach(ReflectOwnKeys(descs), (name) => {
          // TODO: Uncurried form
          // TODO: getOwnPropertyDescriptors is guaranteed to return well-formed
          // descriptors, but they still inherit from Object.prototype. If
          // someone has poisoned Object.prototype to add 'value' or 'get'
          // properties, then a simple 'if ("value" in desc)' or 'desc.value'
          // test could be confused. We use hasOwnProperty to be sure about
          // whether 'value' is present or not, which tells us for sure that
          // this is a data property.
          const desc = descs[name];
          if ('value' in desc) {
            // todo uncurried form
            enqueue(desc.value);
          } else {
            enqueue(desc.get);
            enqueue(desc.set);
          }
        });
      }

      function dequeue() {
        // New values added before forEach() has finished will be visited.
        freezingSet.forEach(doFreeze); // TODO: Curried forEach
      }

      function commit() {
        // TODO: Curried forEach
        // We capture the real WeakSet.prototype.add above, in case someone
        // changes it. The two-argument form of forEach passes the second
        // argument as the 'this' binding, so we add to the correct set.
        freezingSet.forEach(frozenSet.add, frozenSet);
      }

      enqueue(node);
      dequeue();
      commit();
    }

    innerDeepFreeze(root);
    return root;
  }

  /**
   * For a special set of properties (defined below), it ensures that the
   * effect of freezing does not suppress the ability to override these
   * properties on derived objects by simple assignment.
   *
   * Because of lack of sufficient foresight at the time, ES5 unfortunately
   * specified that a simple assignment to a non-existent property must fail if
   * it would override a non-writable data property of the same name. (In
   * retrospect, this was a mistake, but it is now too late and we must live
   * with the consequences.) As a result, simply freezing an object to make it
   * tamper proof has the unfortunate side effect of breaking previously correct
   * code that is considered to have followed JS best practices, if this
   * previous code used assignment to override.
   *
   * To work around this mistake, deepFreeze(), prior to freezing, replaces
   * selected configurable own data properties with accessor properties which
   * simulate what we should have specified -- that assignments to derived
   * objects succeed if otherwise possible.
   */
  function enableDerivedOverride(obj, prop, desc) {
    if ('value' in desc && desc.configurable) {
      const value = desc.value;

      function getter() {
        return value;
      }

      // Re-attach the data property on the object so
      // it can be found by the deep-freeze traversal process.
      getter.value = value;

      function setter(newValue) {
        if (obj === this) {
          // eslint-disable-next-line no-restricted-syntax
          throw new TypeError(
            `Cannot assign to read only property '${prop}' of object '${obj}'`
          );
        }
        if (ObjectPrototypeHasOwnProperty(this, prop)) {
          this[prop] = newValue;
        } else {
          ObjectDefineProperty(this, prop, {
            value: newValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }

      ObjectDefineProperty(obj, prop, {
        get: getter,
        set: setter,
        enumerable: desc.enumerable,
        configurable: desc.configurable
      });
    }
  }

  function enableDerivedOverrides(obj) {
    if (!obj) {
      return;
    }
    const descs = ObjectGetOwnPropertyDescriptors(obj);
    if (!descs) {
      return;
    }
    ArrayPrototypeForEach(ObjectGetOwnPropertyNames(obj), (prop) => {
      return enableDerivedOverride(obj, prop, descs[prop]);
    });
    ArrayPrototypeForEach(ObjectGetOwnPropertySymbols(obj), (prop) => {
      return enableDerivedOverride(obj, prop, descs[prop]);
    });
  }
};