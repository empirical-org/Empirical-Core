require 'coveralls'
Coveralls.wear!

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/rails'
require 'turn/autorun'

Turn.config do |c|
  c.verbose = true
  c.natural = true
end

DatabaseCleaner.strategy = :truncation # cannot use :transaction because test suite runs in
                                       # separate process with separate database connection

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!
end

class MiniTest::Spec
  before :each do
    DatabaseCleaner.start
  end

  after :each do
    DatabaseCleaner.clean
  end
end
