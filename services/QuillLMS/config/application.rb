# frozen_string_literal: true

require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require 'active_support/core_ext/hash/indifferent_access'


# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module EmpiricalGrammar
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # load custom extensions
    Dir[Rails.root.join("app/lib/extensions/**/*.rb")].sort.each { |f| require f }
    require Rails.root.join("app/lib/constants.rb")

    config.cache_store = :redis_store, ENV["REDISCLOUD_URL"]

    config.paperclip_defaults = {
      storage: :fog,
      fog_credentials: { provider: ENV.fetch('FOG_PROVIDER', 'AWS'), aws_access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', ''),
                         aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', '')},
      fog_directory: ENV.fetch('FOG_DIRECTORY', 'empirical-dev')
    }

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/app/controllers/concerns
      #{config.root}/app/models/validators
      #{config.root}/app/queries/scorebook
      #{config.root}/app/services
      #{config.root}/app/services/analytics
      #{config.root}/app/services/vitally_integration
      #{config.root}/app/uploaders
      #{config.root}/lib
    )

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.assets.initialize_on_precompile = false

    config.action_mailer.preview_path = "#{Rails.root}/lib/mailer_previews"

    # changed config.exceptions_app from what was commented out
    # in order to enable custom controller actions https://mattbrictson.com/dynamic-rails-error-pages
    config.exceptions_app = routes
    # config.exceptions_app = Proc.new do |env|
    #   ApplicationController.action(:show_errors).call(env)
    # end

    # CHange schema format so that we can use trigrams. [and SQL functions,
    # https://stackoverflow.com/questions/31953498/can-i-write-postgresql-functions-on-ruby-on-rails
    # Aug 21, 2018 Max Buck]
    config.active_record.schema_format = :sql

    config.action_controller.always_permitted_parameters = %w(controller action format)

    # http://stackoverflow.com/questions/14647731/rails-converts-empty-arrays-into-nils-in-params-of-the-request
    config.action_dispatch.perform_deep_munge = false

    config.middleware.use Rack::Deflater
    config.middleware.use Rack::Attack
    config.middleware.use Rack::Affiliates, { param: 'referral_code' }

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'quill.org', %r{https://(.)*.quill.org}, /localhost:.*/, /127.0.0.1:.*/
        resource '/api/*', headers: :any, methods: [:get, :post, :patch, :put, :delete, :options], credentials: true
      end
    end

    config.public_file_server.enabled = true

    config.public_file_server.headers = {
      'Access-Control-Allow-Origin' => '*'
    }
  end
end
