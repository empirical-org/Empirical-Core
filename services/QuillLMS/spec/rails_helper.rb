ENV["RAILS_ENV"] = 'test'
require 'simplecov'
SimpleCov.start "rails"

require File.expand_path("../../config/environment", __FILE__)

require 'rspec/rails'
require 'capybara/poltergeist'
require 'capybara/rails'
require 'database_cleaner'
require 'byebug'
require 'vcr'
require 'sidekiq/testing'
require 'factory_bot_rails'
require 'spec_helper'

# Use a fake Sidekiq since we don't maintain redis for testing
Sidekiq::Testing.fake!

# Stub out web requests
VCR.configure do |c|
  c.cassette_library_dir = 'spec/cassettes'
  c.hook_into :webmock
  c.configure_rspec_metadata!
  c.ignore_hosts 'codeclimate.com'
  c.allow_http_connections_when_no_cassette = false
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end


Capybara.configure do |config|
  # Use a high(er) timeout for JS-based UI -- e.g., React.js
  # Give Selenium a bit more time to render before declaring an async component test a failure
  config.default_max_wait_time = 15

  Capybara.register_driver :poltergeist do |app|
    Capybara::Poltergeist::Driver.new(app, js_errors: false, timeout: 10)
  end

  config.javascript_driver = :poltergeist
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].sort.each {|f| require f}

# shared contexts and groups to behave like
Dir[Rails.root.join("spec/shared/**/*.rb")].sort.each {|f| require f}

# ensure the db is properly migrated
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.include MockDataHelper
  config.include SanitizationHelper
  config.include SessionHelper
  config.include FactoryBot::Syntax::Methods
  config.include ActiveSupport::Testing::TimeHelpers

  # Ensure that if we are running js tests, we are using latest webpack assets
  # This will use the defaults of :js and :server_rendering meta tags
  ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"

  config.before(:suite) do
    Rails.cache.clear
    DatabaseCleaner.clean_with(:truncation)
  end

  # most examples
  config.before do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
    SegmentAnalytics.backend = FakeSegmentBackend.new
  end

  # examples running in a browser
  # config.before(:each, js: true) do
  #   DatabaseCleaner.strategy = :truncation
  # end


  config.after { DatabaseCleaner.clean }

  config.infer_spec_type_from_file_location!

  # focus tests
  config.filter_run focus: true
  config.silence_filter_announcements = true
  config.run_all_when_everything_filtered = true

  config.around(:each, :caching) do |example|
    caching = ActionController::Base.perform_caching
    ActionController::Base.perform_caching = example.metadata[:caching]
    example.run
    ActionController::Base.perform_caching = caching
  end

end

if defined?(Coveralls)
  Coveralls.wear!('rails')
end

def vcr_ignores_localhost
  VCR.configuration.ignore_localhost = true
end
