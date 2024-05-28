# frozen_string_literal: true

module Evidence
  module VertexAI
    class EndpointClient < Client
      SERVICE_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::EndpointService::Client

      def list_model_names_and_projects
        service_client
          .list_endpoints(parent:)
          .select { |endpoint| matching_deployed_model?(endpoint) }
          .map { |endpoint| "#{endpoint.display_name},#{project}" }
      end

      def find_endpoint(name:)
        service_client
          .list_endpoints(parent:)
          .find { |endpoint| endpoint.display_name == name }
      end

      private def matching_deployed_model?(endpoint)
        endpoint
          .deployed_models
          .any? { |model| model.display_name == endpoint.display_name }
      end
    end
  end
end
