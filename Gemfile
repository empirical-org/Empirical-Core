source 'https://rubygems.org'
# ruby '1.9.3'

gem 'rails', '~> 4'
gem 'pg', platforms: :ruby
gem 'activerecord-jdbcpostgresql-adapter', platforms: :jruby
gem 'rails_12factor', group: [:production, :staging]

gem 'sass-rails', '~> 4.0.0'
gem 'coffee-rails'
gem 'uglifier'
gem 'turbolinks'
gem 'bootstrap-sass'
gem 'compass-rails'
gem 'jquery-rails'
gem 'rails-backbone'
gem 'haml_coffee_assets'
gem 'honey-cms', '0.4.7', path: 'vendor/gems/honey-cms-0.4.7'
gem 'honey-auth'#, path: '../honey-auth'
gem 'haml-rails'
gem 'bcrypt-ruby', require: 'bcrypt'
gem 'ancestry'
gem 'kaminari'
gem 'redcarpet', platforms: :ruby
gem 'kramdown',  platforms: :jruby
gem 'carrierwave'
gem 'fog'
gem 'aws-sdk'
gem 'parslet'
gem 'pry'
gem 'sentry-raven'
gem 'slim-rails'
gem 'taps'
gem 'newrelic_rpm', group: :production
gem 'unicorn', platforms: :ruby
gem 'puma',    platforms: :jruby
gem 'mailchimp-api', require: 'mailchimp'

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_girl_rails'
end

group :test do
  gem 'shoulda-matchers'
  gem 'database_cleaner'
  gem 'capybara'
  gem 'launchy'
  gem 'simplecov'
end

platforms :rbx do
  gem 'rubysl'
  gem 'racc'
  gem 'iconv', github: 'nurse/iconv', branch: 'master'
  gem 'rubinius-coverage'
end
