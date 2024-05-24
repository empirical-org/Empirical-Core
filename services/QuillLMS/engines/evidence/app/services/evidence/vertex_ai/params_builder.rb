# frozen_string_literal: true

module Evidence
  module VertexAI
    class ParamsBuilder < ApplicationService
      attr_reader :name, :project

      def initialize(name:, project:)
        @name = name
        @project = project
      end

      def run
        return {} unless name.present? && endpoint.present? && deployed_model.present?

        { endpoint_external_id:, labels:, model_external_id: }
      end

      private def endpoint = @endpoint ||= EndpointClient.new(project:).find_endpoint(name:)

      private def endpoint_external_id = endpoint.name.split('/').last

      private def labels = ModelClient.new(project:).list_labels(deployed_model:)

      private def deployed_model
        @deployed_model ||= endpoint.deployed_models.find { |model| model.display_name == name }
      end

      private def model_external_id = deployed_model.model.split('/').last
    end
  end
end
