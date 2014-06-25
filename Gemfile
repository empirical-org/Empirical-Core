source 'https://rubygems.org'
# ruby '1.9.3'

gem 'rails', '~> 4'
gem 'pg', platforms: :ruby
gem 'rails_12factor', group: [:production, :staging]

gem 'bcrypt-ruby', '3.1.2'
gem 'ancestry'
gem 'carrierwave'
gem 'fog'
gem 'aws-sdk'
gem 'parslet'
gem 'sentry-raven'
gem 'taps'
gem 'newrelic_rpm', group: :production
gem 'unicorn', platforms: :ruby
gem 'puma',    platforms: :jruby
gem 'mailchimp-api', require: 'mailchimp'
gem 'faraday_middleware'
gem 'doorkeeper'
gem 'queue_classic', '3.0.0rc'

gem 'rspec-rails',        group: %w(development test)
gem 'pry-rails',          group: %w(development test)
gem 'pry-stack_explorer', group: %w(development test)
gem 'factory_girl_rails', group: %w(development test)

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
end

platforms :rbx do
  gem 'rubysl'
  gem 'racc'
  gem 'iconv', github: 'nurse/iconv', branch: 'master'
  gem 'rubinius-coverage'
end

group :test do
  gem 'rspec', group: 'test'
  gem 'database_cleaner'
end

# Quill frontend dependencies
gem 'slim-rails'
gem 'sass-rails', '~> 4.0.0'
gem 'coffee-rails'
gem 'uglifier'
gem 'turbolinks'
gem 'jquery-turbolinks'
gem 'bootstrap-sass'
gem 'compass-rails'
gem 'jquery-rails'
gem 'rails-backbone'
gem 'haml_coffee_assets'
gem 'honey-cms', '0.4.7', path: 'vendor/gems/honey-cms-0.4.7'
gem 'honey-auth'#, path: '../honey-auth'
gem 'haml-rails'
gem 'kaminari'
gem 'redcarpet', platforms: :ruby
gem 'kramdown',  platforms: :jruby
gem 'textacular'
gem 'google-api-client'
gem 'iron_cache_rails'
gem 'table_print'
gem 'mixpanel-ruby'
