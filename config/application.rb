require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

module EmpiricalGrammar
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.paperclip_defaults = {
      storage: :fog,
      fog_credentials: { provider: ENV.fetch('FOG_PROVIDER', 'AWS'), aws_access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', ''),
                         aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', '')},
      fog_directory: ENV.fetch('FOG_DIRECTORY', 'empirical-dev')
    }

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/app/controllers/concerns
      #{config.root}/lib
      #{config.root}/app/uploaders
      #{config.root}/app/services/analytics
      #{config.root}/app/queries/scorebook
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
    config.exceptions_app = self.routes
    # config.exceptions_app = Proc.new do |env|
    #   ApplicationController.action(:show_errors).call(env)
    # end



    # http://stackoverflow.com/questions/14647731/rails-converts-empty-arrays-into-nils-in-params-of-the-request
    config.action_dispatch.perform_deep_munge = false

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        # localhost dev...
        origins 'http://localhost:3001'

        resource '/api/*', headers: :any, methods: [:get, :post, :patch, :put]
      end

      allow do
        origins '*'
        resource '/api/*', headers: :any, methods: [:get, :post, :patch, :put]
      end
    end
  end
end

Raven.configure do |config|
  config.environments = %W(staging production) # Do not enable in development or test environments
end
