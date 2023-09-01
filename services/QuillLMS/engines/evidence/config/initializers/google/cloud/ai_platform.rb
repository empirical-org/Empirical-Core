# frozen_string_literal: true

require "google/cloud/ai_platform/v1"

::Google::Cloud::AIPlatform::V1::DatasetService::Client.configure do |config|
  config.credentials = JSON.parse(ENV.fetch('AI_PLATFORM_CREDENTIALS', '{}'))
end
