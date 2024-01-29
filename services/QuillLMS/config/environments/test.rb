# frozen_string_literal: true

require_relative 'test/multi_db/custom_resolver'
require_relative 'test/multi_db/custom_session'

EmpiricalGrammar::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # The test environment is used exclusively to run your application's
  # test suite. You never need to work with it otherwise. Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs. Don't rely on the data there!
  config.cache_classes = false

  config.logger = ActiveSupport::Logger.new(STDOUT)

  # Do not eager load code on boot. This avoids loading your whole application
  # just for the purpose of running a single test. If you are using a tool that
  # preloads Rails for running tests, you may have to set it to true.
  config.eager_load = false
  config.active_record.dump_schema_after_migration = false

  # Configure static asset server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = { 'Cache-Control' => 'public, max-age=3600' }

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Raise exceptions instead of rendering exception templates.
  config.action_dispatch.show_exceptions = false

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test
  config.action_mailer.default_url_options = { :host => "test.yourhost.com" }

  # Used for zeitwerk
  config.eager_load = ENV['CI'].present?

  # Print deprecation notices to the stderr.
  config.active_support.deprecation = :stderr

  config.cache_store = :memory_store, {size: 64.megabytes}

  config.active_record.database_selector = { delay: 0.seconds }
  config.active_record.database_resolver = Test::MultiDb::CustomResolver
  config.active_record.database_resolver_context = Test::MultiDb::CustomSession
end
