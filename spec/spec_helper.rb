ENV["RAILS_ENV"] = 'test'

require File.expand_path("../../config/environment", __FILE__)

require 'rspec/rails'
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
end

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

# shared contexts and groups to behave like
Dir[Rails.root.join("spec/shared/**/*.rb")].each {|f| require f}

# ensure the db is properly migrated
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
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

  # database cleaner config
  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation #:transaction doesn't clean
    DatabaseCleaner.clean_with(:truncation)

    # validate factories
    FactoryGirl.lint
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

  # factory girl stats
  config.before(:suite) do
    @factory_girl_results = {}
    ActiveSupport::Notifications.subscribe("factory_girl.run_factory") do |name, start, finish, id, payload|
      factory_name = payload[:name]
      strategy_name = payload[:strategy]
      @factory_girl_results[factory_name] ||= {}
      @factory_girl_results[factory_name][strategy_name] ||= 0
      @factory_girl_results[factory_name][strategy_name] += 1
    end
  end

  config.after(:suite) do
    puts "\nFactory Girl Run Results.. [strategies per factory]:"
    ap @factory_girl_results
  end

end

if defined?(Coveralls)
  Coveralls.wear!('rails')
end

