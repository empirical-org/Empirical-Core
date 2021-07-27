$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "comprehension/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "comprehension"
  s.version     = Comprehension::VERSION
  s.authors     = ["Quill.org"]
  s.email       = ["devtools@quill.org"]
  s.homepage    = "https://www.quill.org"
  s.summary     = "Comprehension app as a rails engine"
  s.description = "API endpoints used by Comprehension to be mounted in the main app"
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["spec/**/*"]

  s.add_dependency "google-cloud-automl", "~> 1.0.2"
  s.add_dependency "google-cloud-automl-v1", "~> 0.3.0"
  s.add_dependency "rails", "5.1.7"

  # Gems needed for the test environment
  s.add_development_dependency 'factory_bot_rails'
  s.add_development_dependency 'pg', '0.18.4'
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'shoulda', '~> 4.0'
end
