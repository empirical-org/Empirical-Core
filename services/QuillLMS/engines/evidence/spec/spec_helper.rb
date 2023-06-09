# frozen_string_literal: true

require 'simplecov'
require 'simplecov-json'
require 'webmock/rspec'
WebMock.disable_net_connect!


if ENV['CONTINUOUS_INTEGRATION'] == true
  SimpleCov.formatters = SimpleCov::Formatter::MultiFormatter.new([
    SimpleCov::Formatter::HTMLFormatter,
    SimpleCov::Formatter::JSONFormatter
  ])

  SimpleCov.start do
    track_files '{app,lib}/**/*.rb'
    add_filter '/spec/'
  end
end

