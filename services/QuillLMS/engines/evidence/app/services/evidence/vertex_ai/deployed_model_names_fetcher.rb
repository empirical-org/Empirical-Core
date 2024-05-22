# frozen_string_literal: true

module Evidence
  module VertexAI
    class DeployedModelNamesFetcher < ApplicationService
      def run
        endpoints
          .select { |endpoint| matching_deployed_model?(endpoint) }
          .map(&:display_name)
          .sort
      end

      private def endpoints
        endpoint_client.list_endpoints(parent: parent)
      end

      private def endpoint_client
        ::Google::Cloud::AIPlatform::V1::EndpointService::Client.new
      end

      private def matching_deployed_model?(endpoint)
        endpoint
          .deployed_models
          .any? { |model| model.display_name == endpoint.display_name }
      end

      private def parent
        "projects/#{VERTEX_AI_PROJECT_ID}/locations/#{VERTEX_AI_LOCATION}"
      end
    end
  end
end
