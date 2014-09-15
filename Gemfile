source 'https://rubygems.org'

ruby '2.1.2'

# CORE DEPS
gem 'rails', '~> 4.1.4'
gem 'puma'

# DB/MODEL
gem 'pg'
gem 'ancestry'
gem 'taps'
gem 'table_print'
gem 'ransack'

# USER AUTH, ETC
gem 'bcrypt'
gem 'doorkeeper'
gem 'omniauth'
gem 'omniauth-clever'
gem 'cancancan'

# UPLOADS
gem 'carrierwave'
gem 'fog'
gem 'aws-sdk'

# OTHERS
gem 'google-api-client'
gem 'mailchimp-api', require: 'mailchimp'
gem 'faraday_middleware'

# PARSING
gem 'parslet'
gem 'redcarpet'

# QUEUE/CACHE
gem 'iron_cache_rails'

# JS/APP/UI
gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'select2-rails'
gem 'jbuilder'

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
gem 'uglifier'
gem 'kaminari'

# MIDDLEWARE
gem 'rack-cache', require: 'rack/cache'
gem 'rack-cors',  require: 'rack/cors'

# CMS (HONEY)
gem 'honey-cms', '0.4.7', path: 'vendor/gems/honey-cms-0.4.7'

# DEPLOYMENT
gem 'sentry-raven'

# INTEGRATIONS
gem 'clever-ruby', github: 'Veraticus/clever-ruby', branch: 'extract_linked_resources'

group :production, :staging do
  gem 'rails_12factor'
  gem 'newrelic_rpm'
  # JC: in dev, at least on my machine, this throws SSL errors
  gem 'mixpanel-ruby'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller', platforms: [:mri_21]
  gem 'foreman'
  gem "letter_opener"
end

group :test, :development do
  gem 'dotenv'
  gem "quiet_assets"
  gem 'pry'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-coolline'
  gem 'pry-rescue'
  gem "awesome_print", github: 'imajes/awesome_print'
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
