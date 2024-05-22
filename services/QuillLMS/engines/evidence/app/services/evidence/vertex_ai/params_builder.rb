# frozen_string_literal: true

module Evidence
  module VertexAI
    class ParamsBuilder < ApplicationService
      ANNOTATION_SPECS = 'annotationSpecs'
      DISPLAY_NAME = 'displayName'
      CONFUSION_MATRIX = 'confusionMatrix'

      ENDPOINT_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::EndpointService::Client
      MODEL_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::ModelService::Client

      attr_reader :name, :project

      def initialize(name:, project:)
        @name = name
        @project = project
      end

      def run
        return {} unless name.present? && endpoint.present? && deployed_model.present?

        { endpoint_external_id:, labels:, model_external_id: }
      end


      private def endpoint
        @endpoint ||=
          ClientFetcher
            .run(client_class: ENDPOINT_CLIENT_CLASS, project:)
            .list_endpoints(parent:)
            .find { |ep| ep.display_name == name }
      end

      private def endpoint_external_id = endpoint.name.split('/').last

      private def labels
        ClientFetcher
          .run(client_class: MODEL_CLIENT_CLASS, project:)
          .list_model_evaluations(parent: deployed_model.model)
          .first
          .to_h
          .dig(:metrics, :struct_value, :fields, CONFUSION_MATRIX, :struct_value, :fields, ANNOTATION_SPECS, :list_value, :values)
          .map { |v| v.dig(:struct_value, :fields, DISPLAY_NAME, :string_value) }
          .flatten
          .reject(&:empty?)
          .uniq
      end

      private def deployed_model
        @deployed_model ||= endpoint.deployed_models.find { |model| model.display_name == name }
      end

      private def model_external_id = deployed_model.model.split('/').last

      private def parent = "projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}"

      private def project_id = ClientFetcher.project_id(project)
    end
  end
end
