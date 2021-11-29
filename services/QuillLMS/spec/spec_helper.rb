# frozen_string_literal: true

require 'simplecov'
require 'simplecov-json'
require 'webmock/rspec'

WebMock.disable_net_connect!

RSpec.configure do |config|
  config.formatter = :progress
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
end

if ENV['CONTINUOUS_INTEGRATION'] == true
  SimpleCov.formatters = SimpleCov::Formatter::MultiFormatter.new([
    SimpleCov::Formatter::HTMLFormatter,
    SimpleCov::Formatter::JSONFormatter,
  ])

  SimpleCov.start do
    track_files '{app,lib}/**/*.rb'
    add_filter '/spec/'
  end
end
