# frozen_string_literal: true

require 'google/cloud/ai_platform'
require 'google/cloud/ai_platform/v1'

VERTEX_AI_LOCATION = ENV.fetch('VERTEX_AI_LOCATION', '')
VERTEX_AI_ENDPOINT = ENV.fetch('VERTEX_AI_ENDPOINT', '')

::Google::Cloud::AIPlatform.configure do |config|
  config.endpoint = VERTEX_AI_ENDPOINT
end
