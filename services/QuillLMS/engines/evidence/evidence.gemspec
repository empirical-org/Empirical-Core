# frozen_string_literal: true

$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'evidence/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'evidence'
  s.version     = Evidence::Version::VERSION
  s.authors     = ['Quill.org']
  s.email       = ['devtools@quill.org']
  s.homepage    = 'https://www.quill.org'
  s.summary     = 'Evidence app as a rails engine'
  s.description = 'API endpoints used by Evidence to be mounted in the main app'
  s.license     = 'MIT'
  s.required_ruby_version = '>= 3.1'

  s.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']

  s.add_dependency 'google-cloud-ai_platform', '~> 1.0.0'
  s.add_dependency 'hotwater', '0.1.2'
  s.add_dependency 'neighbor', '~> 0.3.2'
  s.add_dependency 'parslet', '~> 1.8.2'
  s.add_dependency 'pragmatic_segmenter', '~> 0.3.23'
  s.add_dependency 'rails', '7.0.6'
  s.add_dependency 'sprockets-rails', '3.2.2'

  # Gems needed for the test environment
  s.add_development_dependency 'dotenv-rails', '2.7.6'
  s.add_development_dependency 'factory_bot_rails'
  s.add_development_dependency 'faker', '3.2.0'
  s.add_development_dependency 'pg', '1.4.2'
  s.add_development_dependency 'redis', '~> 4.5'
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'shoulda', '~> 4.0'
  s.add_development_dependency 'sidekiq', '~> 5.2.10'
  s.add_development_dependency 'sidekiq-pro'
end
