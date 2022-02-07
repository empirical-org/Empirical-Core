# frozen_string_literal: true

EmpiricalGrammar::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true

  config.action_dispatch.show_detailed_exceptions = false
  config.action_controller.perform_caching = false

  config.action_controller.asset_host

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  # Raise an error in development when an invalid parameter is passed.
  config.action_controller.action_on_unpermitted_parameters = :raise

  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    user_name:      ENV['SENDGRID_USERNAME'],
    password:       ENV['SENDGRID_PASSWORD'],
    address:        'smtp.sendgrid.net',
    port:           '587',
    authentication: :plain,
    enable_starttls_auto: true
  }

  config.assets.precompile += %w(sign_up_email.css)

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log
  config.log_level = :debug

  config.logger = Logger.new($stdout)

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  config.sass.line_comments = true
  config.sass.line_numbers = true
  config.sass.debug_info = true
  config.action_mailer.default_url_options = { host: 'localhost:3000' }
  Rails.application.routes.default_url_options[:host] =  'localhost:3000'

  # Image Uploads (see paperclip gem)
  Paperclip.options[:command_path] = "/usr/local/bin/"

  if ENV['REDISCLOUD_URL']
    config.action_controller.perform_caching = true
    config.cache_store = :redis_store, ENV["REDISCLOUD_URL"]
  else
    config.action_controller.perform_caching = false
  end

  config.reload_plugins = true if Rails.env.development?
end
