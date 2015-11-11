source 'https://rubygems.org'

ruby '2.2.2'

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
gem 'postgres_ext'

# USER AUTH, ETC
gem 'bcrypt'
gem 'doorkeeper', '1.4.1' # must use 1.4.1 or > 2.0.0 - http://seclists.org/oss-sec/2014/q4/1076
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'omniauth-clever'
gem 'cancancan'
gem 'firebase_token_generator'

# EMAIL
gem 'premailer-rails'
gem 'nokogiri' # required for premailer

# VALIDATIONS
gem 'validates_email_format_of'

# UPLOADS
gem 'carrierwave'
gem 'fog', require: 'fog/aws/storage'

# IMAGE UPLOADS
gem 'paperclip'
gem "jquery-fileupload-rails"

# OTHERS
gem 'global'
gem 'google-api-client'
gem 'mailchimp-api', require: 'mailchimp'
gem 'faraday_middleware'

# PARSING
gem 'parslet'
gem 'redcarpet'
gem 'addressable'

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
gem 'active_link_to'
gem 'lodash-rails'

# METRICS
gem 'keen'
gem 'analytics-ruby', '~> 2.0.0', :require => 'segment/analytics'

# API
gem "active_model_serializers"

# UI HELPERS
gem 'sass'
gem 'sass-rails', github: 'rails/sass-rails'
gem 'bootstrap-sass', '~> 2.1.1.0' # honey-cms needs this, unused by the main app

gem 'coffee-rails'
gem 'jquery-rails'
gem 'jquery-ui-rails'

gem 'slim-rails'
gem 'haml-rails'

gem 'es5-shim-rails'
gem 'react-rails', '1.4.1'

# ASSET/UI
gem 'therubyracer', require: false
gem 'uglifier',     require: false
gem 'kaminari'


# MIDDLEWARE
gem 'rack-cache', require: 'rack/cache'
gem 'rack-cors',  require: 'rack/cors'

# DEPLOYMENT
gem 'sentry-raven', '>= 0.12.2'
gem 'asset_sync'
gem 'rack-heartbeat'

# INTEGRATIONS
gem 'clever-ruby', '0.10.0'

group :production, :staging do
  gem 'rails_12factor'
  gem 'newrelic_rpm'
  gem 'lograge' # for making logs more dense
end

group :development do
  gem 'bullet'
  gem 'better_errors'
  gem 'binding_of_caller', platforms: [:mri_21]
  gem 'foreman'
  gem "letter_opener"
  gem 'spring'
  gem 'spring-commands-rspec'
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
  gem 'guard-shell'
  gem 'terminal-notifier-guard'
  gem 'teaspoon-mocha'
end

group :test do
  gem 'capybara'
  gem 'poltergeist'
  gem "vcr"
  gem "webmock"
end
