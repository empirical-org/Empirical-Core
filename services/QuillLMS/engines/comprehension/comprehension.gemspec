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
  s.test_files = Dir["test/**/*"]

  s.add_dependency "google-cloud-automl", "~> 1.0.2"
  s.add_dependency "rails", "~> 4.2.11.1"

  # Gems needed for the test environment
  s.add_development_dependency 'factory_bot_rails'
  s.add_development_dependency "pg", '0.18.4'
  s.add_development_dependency 'rails-controller-testing'
  s.add_development_dependency 'shoulda', '~> 3.5'
  s.add_development_dependency 'shoulda-matchers', '~> 2.0'
end
