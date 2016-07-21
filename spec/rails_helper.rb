ENV["RAILS_ENV"] = 'test'

require File.expand_path("../../config/environment", __FILE__)

require 'rspec/rails'
require 'capybara/poltergeist'
require 'capybara/rails'
require 'database_cleaner'
require 'byebug'
require 'vcr'
require 'sidekiq/testing'

# Use a fake Sidekiq for Travis (Redis not available)
Sidekiq::Testing.fake!

# Stub out web requests
VCR.configure do |c|
  c.cassette_library_dir = 'spec/cassettes'
  c.hook_into :webmock
  c.configure_rspec_metadata!
  c.ignore_hosts 'codeclimate.com'
  c.allow_http_connections_when_no_cassette = true
end


Capybara.configure do |config|
  # Use a high(er) timeout for JS-based UI -- e.g., React.js
  # cf http://docs.travis-ci.com/user/common-build-problems/#Capybara%3A-I'm-getting-errors-about-elements-not-being-found
  config.default_max_wait_time = 15  # increased from 15 since we were getting Net Timeout errors on Tracis CI (and not on local)

  Capybara.register_driver :poltergeist do |app|
    Capybara::Poltergeist::Driver.new(app, js_errors: false, timeout: 10)
  end

  config.javascript_driver = :poltergeist
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

# shared contexts and groups to behave like
Dir[Rails.root.join("spec/shared/**/*.rb")].each {|f| require f}

# ensure the db is properly migrated
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  # Ensure that if we are running js tests, we are using latest webpack assets
  # This will use the defaults of :js and :server_rendering meta tags
  ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)

  # ## Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = false

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234
  config.order = "random"

  # database cleaner config
  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)

    begin
      # validate factories
      FactoryGirl.lint
    ensure
      # (re-?)clean the database after
      DatabaseCleaner.clean_with(:truncation)
    end
  end

  # most examples
  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
  end

  # examples running in a browser
  config.before(:each, js: true) do
    DatabaseCleaner.strategy = :truncation
  end

  config.before(:each) do
    DatabaseCleaner.start

    SegmentAnalytics.backend = FakeSegmentBackend.new
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  config.infer_spec_type_from_file_location!

  # focus tests
  config.filter_run focus: true
  config.run_all_when_everything_filtered = true

  # some stuff that happens before all of the suite
  config.before(:suite) do
    # FactoryGirl.create(:topic) unless Topic.any?
    Rails.cache.clear
  end

  # user_params and sign_in methods
  config.include SessionHelper

  config.include FactoryGirl::Syntax::Methods
end

if defined?(Coveralls)
  Coveralls.wear!('rails')
end

def vcr_ignores_localhost
  VCR.configuration.ignore_localhost = true
end
