# -*- encoding: utf-8 -*-
# stub: coffee-rails 4.2.2 ruby lib

Gem::Specification.new do |s|
  s.name = "coffee-rails".freeze
  s.version = "4.2.2"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Santiago Pastorino".freeze]
  s.date = "2017-05-24"
  s.description = "CoffeeScript adapter for the Rails asset pipeline.".freeze
  s.email = ["santiago@wyeworks.com".freeze]
  s.homepage = "https://github.com/rails/coffee-rails".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.4.1".freeze
  s.summary = "CoffeeScript adapter for the Rails asset pipeline.".freeze

  s.installed_by_version = "3.4.1" if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<coffee-script>.freeze, [">= 2.2.0"])
  s.add_runtime_dependency(%q<railties>.freeze, [">= 4.0.0"])
end
