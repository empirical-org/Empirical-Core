# frozen_string_literal: true

module Evidence
  module VertexAI
    class DeployedModelNamesAndProjectsFetcher < ApplicationService
      ENDPOINT_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::EndpointService::Client

      def run
        projects
          .map { |project| fetch_deployed_model_names_and_projects(project) }
          .flatten
          .sort
      end

      private def projects = AutomlModel.all.pluck(:project).uniq

      private def fetch_deployed_model_names_and_projects(project)
        client(project)
          .list_endpoints(parent: parent(ClientFetcher.project_id(project)))
          .select { |endpoint| matching_deployed_model?(endpoint) }
          .map { |endpoint| "#{endpoint.display_name},#{project}" }
      end

      private def client(project) = ClientFetcher.run(client_class: ENDPOINT_CLIENT_CLASS, project:)

      private def matching_deployed_model?(endpoint)
        endpoint
          .deployed_models
          .any? { |model| model.display_name == endpoint.display_name }
      end

      private def parent(project_id) = "projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}"
    end
  end
end
