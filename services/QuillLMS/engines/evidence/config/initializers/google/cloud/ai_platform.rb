# frozen_string_literal: true

require 'google/cloud/ai_platform'

::Google::Cloud::AIPlatform.configure do |config|
  config.credentials = JSON.parse(ENV.fetch('AI_PLATFORM_CREDENTIALS', '{}'))
  config.endpoint = ENV.fetch('AI_PLATFORM_ENDPOINT', '')
end