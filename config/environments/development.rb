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

  # Raise an error in development when an invalid parameter is passed.
  config.action_controller.action_on_unpermitted_parameters = :raise

  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    user_name:      'empirical-4992b81d85ba4277',
    password:       'a9fa483334b2eeeb',
    address:        'mailtrap.io',
    port:           '2525',
    authentication: :plain
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log
  config.log_level = :debug

  # Raise an error on page load if there are pending migrations
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true




  config.sass.line_comments = true
  config.sass.line_numbers = true
  config.sass.debug_info = true
  config.action_mailer.default_url_options = { :host => 'quill.dev' }

  config.after_initialize do
    Bullet.enable = true
    Bullet.console = true
    Bullet.rails_logger = true
  end

end