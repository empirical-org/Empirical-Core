# frozen_string_literal: true

ENV['RAILS_ENV'] = 'test'

require File.expand_path('../../config/environment', __FILE__)

require 'rspec/rails'
require 'capybara/rails'
require 'byebug'
require 'vcr'
require 'sidekiq/testing'
require 'factory_bot_rails'
require 'spec_helper'

# This should eager load the TeacherNotification sub-classes which is necessary in our testing environment because we use
# the TeacherNotification.subclasses call for validation, and without eager loading that value starts as an empty array
Dir[File.join(__dir__, '..', 'app', 'models', 'teacher_notifications', '*.rb')].each { |file| require file }

# Use a fake Sidekiq since we don't maintain redis for testing
Sidekiq::Testing.fake!

# Stub out web requests
VCR.configure do |c|
  c.cassette_library_dir = 'spec/cassettes'
  c.hook_into :webmock
  c.configure_rspec_metadata!
  c.ignore_hosts 'codeclimate.com'
  c.ignore_localhost = true
  c.allow_http_connections_when_no_cassette = false
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

# Define any negatated matchers we need
# https://relishapp.com/rspec/rspec-expectations/v/3-8/docs/define-negated-matcher
RSpec::Matchers.define_negated_matcher :not_change, :change

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }

# shared contexts and groups to behave like
Dir[Rails.root.join('spec/shared/**/*.rb')].each { |f| require f }

# ensure the db is properly migrated
ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.include MockDataHelper
  config.include SanitizationHelper
  config.include SessionHelper
  config.include FactoryBot::Syntax::Methods
  config.include ActiveSupport::Testing::TimeHelpers

  # Ensure that if we are running js tests, we are using latest vite assets
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
  config.order = 'random'

  config.before(:suite) { Rails.cache.clear }
  config.before { Analytics::SegmentAnalytics.backend = FakeSegmentBackend.new }

  config.infer_spec_type_from_file_location!

  config.filter_run focus: true

  config.filter_run_excluding benchmarking: true
  config.filter_run_excluding big_query_snapshot: true
  config.filter_run_excluding broken: true # TODO: remove after fixing
  config.filter_run_excluding external_api: true

  config.silence_filter_announcements = true
  config.run_all_when_everything_filtered = true

  config.around(:each, :caching) do |example|
    caching = ActionController::Base.perform_caching
    ActionController::Base.perform_caching = example.metadata[:caching]
    example.run
    ActionController::Base.perform_caching = caching
  end

  config.around(:each, :external_api) { |example| with_vcr_and_webmock_disabled { example.run } }
  config.around(:each, :big_query_snapshot) { |example| with_vcr_and_webmock_disabled { example.run } }

  if ENV.fetch('SUPPRESS_PUTS', false) == 'true'
    config.before do
      allow($stdout).to receive(:puts)
      allow($stdout).to receive(:write)
    end
  end
end

private def with_vcr_and_webmock_disabled
  VCR.turned_off do
    WebMock.allow_net_connect!
    yield
    WebMock.disable_net_connect!
  end
end
