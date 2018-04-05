source 'https://rubygems.org'

ruby '2.3.1'

# CORE DEPS
gem 'rails', '=4.2.7.1'
gem 'puma', '~> 3.10.0'

# EARLY TO APPLY TO OTHER GEMS
gem 'dotenv-rails'

# DB/MODEL
gem 'pg', '0.18.4'
gem 'ancestry'
gem 'ransack'
gem 'ranked-model'
gem 'postgres_ext'
gem 'rails_admin', '1.2.0'
gem 'bulk_insert'
gem 'atomic_arrays'

# USER AUTH, ETC
gem 'bcrypt'
gem 'doorkeeper', '1.4.1'
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'omniauth-clever'
gem 'cancancan'
gem 'firebase_token_generator'
gem 'rack-attack'

# EMAIL
gem 'premailer-rails'
# if you have trouble installing nokogiri on a mac,
# try uninstalling nokogiri, running `xcode-select --install`, and then `bundle install` once more
gem 'nokogiri' # required for premailer

# VALIDATIONS
gem 'validates_email_format_of'

# CONTROLLERS
gem 'responders'

# UPLOADS
gem 'carrierwave', '~> 1.0'
gem 'fog-aws'

# TIME
gem 'time_difference'

# OTHERS
gem 'global'
gem 'google-api-client', '0.8.6'
gem 'faraday_middleware'
gem 'newrelic_rpm'
gem 'skylight'
gem 'pointpin', '~> 1.0.0' #IP-GEOLOCATION
gem 'stripe'
gem 'prawn'
gem 'prawn-table'
gem 'pdf-core'
gem 'pdf-inspector'
gem 'ttfunk'
gem 'scout_apm'
gem 'rubyzip'
gem 'httparty'
gem 'intercom', '~> 3.5.23'

# WEBSOCKETS
gem 'pusher'

# PARSING
gem 'parslet'
gem 'redcarpet'
gem 'addressable'

# QUEUE/CACHE
gem 'sidekiq'
gem 'sidekiq-retries', require: false
gem 'redis', "3.3.5"
gem 'redis-namespace'
gem 'redis-rails'
gem 'redis-rack-cache'
gem 'sinatra', '>= 1.3.0', :require => nil

# JS/APP/UI
gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'select2-rails'
gem 'jbuilder'
gem 'active_link_to'

# METRICS
gem 'analytics-ruby', '~> 2.0.0', :require => 'segment/analytics'
gem 'salesmachine-ruby', '~> 1.0.0'

# API
gem "active_model_serializers", '~> 0.9.0'

# UI HELPERS
gem 'sass'
gem 'sass-rails'

gem 'coffee-rails'
gem 'jquery-rails'

gem 'slim-rails'
gem 'haml-rails'

gem 'es5-shim-rails'
gem "react_on_rails", "~> 10.1.3"
gem "webpacker", "~> 3.0.0"

# ASSET/UI
gem 'therubyracer', require: false
gem 'uglifier',     require: false
gem 'kaminari'

# FACTORY BOT (because Cypress needs it not to scoped to test)
gem "factory_bot", require: false
gem "factory_bot_rails", require: false


# MIDDLEWARE
gem 'rack-cache', '~> 1.6.1', require: 'rack/cache'
gem 'rack-cors', require: 'rack/cors'
gem 'rack-host-redirect'
gem 'rack-affiliates', '~> 0.4.0'

# DEPLOYMENT
gem 'sentry-raven', '>= 0.12.2'
gem 'rack-heartbeat'

# INTEGRATIONS
gem 'clever-ruby', '~> 0.13.2'

group :production, :staging do
  gem 'rails_12factor'
  gem 'lograge' # for making logs more dense
  # gem "rack-timeout"
end

group :development do
  gem 'bullet'
  gem 'better_errors'
  gem 'binding_of_caller', platforms: [:mri_21]
  gem 'foreman'
  gem "letter_opener"
  gem 'spring'
  gem 'spring-commands-rspec'
  gem 'livingstyleguide'
end

gem "awesome_print"

group :test, :development do
  gem "quiet_assets"
  gem 'pry'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-coolline'
  gem 'pry-rescue'
  gem "rspec-rails", '~> 3.7.2'
  gem 'fuubar', '~> 2.0.0.rc1'
  gem "timecop"
  gem "database_cleaner"
  gem 'byebug', '8.2.1' # getting errors on mac yosemite when trying to install 8.2.2
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-shell'
  gem 'terminal-notifier-guard'
  gem 'teaspoon-mocha'
  gem 'rspec-retry'
  gem 'rspec-redis_helper'
  gem 'brakeman'
  gem 'zeus-parallel_tests'
  gem 'parallel_tests'
end

group :test, :development, :cypress do
  gem 'faker'
  gem "factory_bot"
  gem "factory_bot_rails"
end

group :test do
  gem 'shoulda-matchers', '~> 3.1'
  gem 'shoulda-callback-matchers', '~> 1.1.1'
  gem 'capybara'
  gem 'poltergeist'
  gem "vcr"
  gem "webmock"
  gem "codeclimate-test-reporter", require: nil
  gem 'simplecov'
  gem 'simplecov-json', require: false
  gem 'codecov'
  # gem 'test_after_commit'
end

# Memory profiling
gem 'puma_worker_killer'
gem 'sqreen'

# temp for migrations
gem 'paperclip'
