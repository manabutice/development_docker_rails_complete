# -*- encoding: utf-8 -*-
# stub: rails-flog 1.6.1 ruby lib

Gem::Specification.new do |s|
  s.name = "rails-flog".freeze
  s.version = "1.6.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["pinzolo".freeze]
  s.date = "2021-01-13"
  s.description = "This formats parameters and sql in rails log.".freeze
  s.email = ["pinzolo@gmail.com".freeze]
  s.homepage = "https://github.com/pinzolo/rails-flog".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.1.6".freeze
  s.summary = "Rails log formatter for parameters and sql".freeze

  s.installed_by_version = "3.1.6" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_development_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_development_dependency(%q<coveralls>.freeze, [">= 0"])
    s.add_development_dependency(%q<minitest>.freeze, [">= 0"])
    s.add_development_dependency(%q<rake>.freeze, [">= 0"])
    s.add_development_dependency(%q<rubocop>.freeze, [">= 0"])
    s.add_development_dependency(%q<sqlite3>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<anbt-sql-formatter>.freeze, [">= 0.0.7"])
    s.add_runtime_dependency(%q<amazing_print>.freeze, [">= 0"])
    s.add_runtime_dependency(%q<rails>.freeze, [">= 4.2.0"])
  else
    s.add_dependency(%q<bundler>.freeze, [">= 0"])
    s.add_dependency(%q<coveralls>.freeze, [">= 0"])
    s.add_dependency(%q<minitest>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, [">= 0"])
    s.add_dependency(%q<rubocop>.freeze, [">= 0"])
    s.add_dependency(%q<sqlite3>.freeze, [">= 0"])
    s.add_dependency(%q<anbt-sql-formatter>.freeze, [">= 0.0.7"])
    s.add_dependency(%q<amazing_print>.freeze, [">= 0"])
    s.add_dependency(%q<rails>.freeze, [">= 4.2.0"])
  end
end
