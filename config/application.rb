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

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/app/controllers/concerns
      #{config.root}/lib
      #{config.root}/app/uploaders
    )


    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.hamlcoffee.escapeHtml = false

    config.assets.initialize_on_precompile = false

    config.action_mailer.preview_path = "#{Rails.root}/lib/mailer_previews"

    config.exceptions_app = Proc.new do |env|
      ApplicationController.action(:show_errors).call(env)
    end

    config.middleware.use Rack::Cors do
      allow do
        # localhost dev...
        origins /localhost|127\.0\.0\.1(:\d+)?/

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
