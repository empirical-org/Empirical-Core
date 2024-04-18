# frozen_string_literal: true

require 'webmock/rspec'
require 'rspec/rails'

WebMock.disable_net_connect!

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

RSpec.configure do |config|
  config.formatter = :progress
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.include FactoryBot::Syntax::Methods
  config.include ActiveSupport::Testing::TimeHelpers

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!

  # Run specs in random order to surface order dependencies. If you find an
  # order dependency and want to debug it, you can fix the order by providing
  # the seed, which is printed after each run.
  #     --seed 1234

  config.order = "random"

  config.filter_run focus: true

  config.filter_run_excluding benchmarking: true
  config.filter_run_excluding big_query_snapshot: true
  config.filter_run_excluding broken: true # TODO: remove after fixing
  config.filter_run_excluding external_api: true

  config.silence_filter_announcements = true
  config.run_all_when_everything_filtered = true

  config.around(:each, :external_api) { |example| with_vcr_and_webmock_disabled { example.run } }
  config.around(:each, :big_query_snapshot) { |example| with_vcr_and_webmock_disabled { example.run } }
end
