require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env)

# https://github.com/rails/sass-rails/issues/157
if Rails.env.development?
  require 'sass'
  require 'sass/engine'

  module Sass
    class Engine
      def initialize(template, options={})
        @options = self.class.normalize_options(options)
        @options[:debug_info] = true
        @template = template
      end
    end
  end
end

module EmpiricalGrammar
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += %W(
      #{config.root}/app/controllers/concerns
      #{config.root}/lib
      #{config.root}/core/models
    )

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.hamlcoffee.escapeHtml = false

    config.assets.initialize_on_precompile = false
  end
end
