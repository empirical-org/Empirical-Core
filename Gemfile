source 'https://rubygems.org'

ruby '2.1.2'

# CORE DEPS
gem 'rails', '~> 4.1.4'
gem 'puma'

# EARLY TO APPLY TO OTHER GEMS
gem 'dotenv-rails'

# DB/MODEL
gem 'pg'
gem 'ancestry'
gem 'ransack'
gem 'ranked-model'

# USER AUTH, ETC
gem 'bcrypt'
gem 'doorkeeper'
gem 'omniauth'
gem 'omniauth-clever'
gem 'cancancan'

# UPLOADS
gem 'carrierwave'
gem 'fog', require: 'fog/aws/storage'

# OTHERS
gem 'google-api-client'
gem 'mailchimp-api', require: 'mailchimp'
gem 'faraday_middleware'

# PARSING
gem 'parslet'
gem 'redcarpet'

# QUEUE/CACHE
gem 'sidekiq'
gem 'sidekiq-retries'
gem 'redis-rails'
gem 'sinatra', '>= 1.3.0', :require => nil

# JS/APP/UI
gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'select2-rails'
gem 'jbuilder'

# METRICS
gem 'keen'
gem 'mixpanel-ruby'

# API
gem "active_model_serializers"

# UI HELPERS
gem 'sass-rails', github: 'rails/sass-rails'
gem 'bootstrap-sass', '~> 2.1.1.0' # app is locked to bootstrap 2.1.0
gem 'compass-rails'

gem 'coffee-rails'
gem 'jquery-rails'
gem 'backbone-on-rails'

gem 'slim-rails'
gem 'haml-rails'
gem 'haml_coffee_assets', github: 'netzpirat/haml_coffee_assets'

# ASSET/UI
gem 'therubyracer', require: false
gem 'uglifier',     require: false
gem 'kaminari'

# MIDDLEWARE
gem 'rack-cache', require: 'rack/cache'
gem 'rack-cors',  require: 'rack/cors'

# CMS (HONEY)
gem 'honey-cms', '0.4.7', path: 'vendor/gems/honey-cms-0.4.7'

# DEPLOYMENT
gem 'sentry-raven', '>= 0.12.2'
gem 'asset_sync'
gem 'rack-heartbeat'

# INTEGRATIONS
gem 'clever-ruby', github: 'Veraticus/clever-ruby', branch: 'extract_linked_resources'

group :production, :staging do
  gem 'rails_12factor'
  gem 'newrelic_rpm'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller', platforms: [:mri_21]
  gem 'foreman'
  gem "letter_opener"
end

gem "awesome_print", github: 'imajes/awesome_print'

group :test, :development do
  gem "quiet_assets"
  gem 'pry'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-coolline'
  gem 'pry-rescue'
  gem "rspec-rails"
  gem 'fuubar', '~> 2.0.0.rc1'
  gem "timecop"
  gem "factory_girl"
  gem "factory_girl_rails"
  gem "forgery"
  gem "database_cleaner"
  gem 'byebug'
  gem 'guard'
  gem 'guard-rspec'
  # test runs for james; this triggers
  # a blink1(m) device to show red/green
  gem 'guard-shell'
  gem 'guard-blink1'
  gem 'terminal-notifier-guard'
end

group :test do
  gem "vcr"
  gem "webmock"
end
