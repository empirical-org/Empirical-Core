# frozen_string_literal: true

RSpec.configure do |config|
  config.include ActiveSupport::Testing::TimeHelpers

  config.around(:each, :freeze_time) { |example| freeze_time { example.run } }

  config.after(:each, :travel_back) { |example| travel_back { example.run } }
end
