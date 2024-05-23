# frozen_string_literal: true

require 'google/cloud/ai_platform'
require 'google/cloud/ai_platform/v1'

VERTEX_AI_PROJECTS = ENV.fetch('VERTEX_AI_PROJECTS', '').split(',')
VERTEX_AI_LOCATION = ENV.fetch('VERTEX_AI_LOCATION', '')
VERTEX_AI_ENDPOINT = ENV.fetch('VERTEX_AI_ENDPOINT', '')

::Google::Cloud::AIPlatform.configure { |config| config.endpoint = VERTEX_AI_ENDPOINT }

module Evidence
  module VertexAI
    VERTEX_AI_PROJECTS.each do |project|
      const_set("VERTEX_AI_CREDENTIALS_#{project.upcase}", JSON.parse(ENV["VERTEX_AI_CREDENTIALS_#{project.upcase}"]))
    end
  end
end
