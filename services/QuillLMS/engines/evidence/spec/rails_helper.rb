# frozen_string_literal: true

require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'

require File.expand_path('../spec/dummy/config/environment', __dir__)

# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?

require 'rspec/rails'
require 'shoulda/matchers'
require 'neighbor'
require 'faker'
require 'dotenv'
Dotenv.load('.env.test')

# Checks for pending migrations and applies them before tests are run.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  puts e.to_s.strip
  exit 1
end

RSpec.configure do |config|
  config.formatter = :progress
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.use_transactional_fixtures = true

  config.include FactoryBot::Syntax::Methods
  config.infer_spec_type_from_file_location!
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.filter_run_excluding benchmarking: true

  config.around(:each, :external_api) { |example| with_webmock_disabled { example.run } }
end

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

private def with_webmock_disabled
  WebMock.allow_net_connect!
  yield
  WebMock.disable_net_connect!
end
