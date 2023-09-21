# frozen_string_literal: true

module Evidence
  module VertexAI
    class ParamsBuilder < ::ApplicationService
      ANNOTATION_SPECS = 'annotationSpecs'
      DISPLAY_NAME = 'displayName'
      CONFUSION_MATRIX = 'confusionMatrix'

      attr_reader :name

      def initialize(name)
        @name = name
      end

      def run
        return {} unless name.present? && endpoint.present? && deployed_model.present?

        {
          endpoint_external_id: endpoint_external_id,
          labels: labels,
          model_external_id: model_external_id,
        }
      end

      private def endpoint
        @endpoint ||=
          endpoint_client
            .list_endpoints(parent: parent)
            .find { |endpoint| endpoint.display_name == name }
      end

      private def endpoint_client
        ::Google::Cloud::AIPlatform::V1::EndpointService::Client.new
      end

      private def endpoint_external_id
        endpoint.name.split('/').last
      end

      private def labels
        model_client
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

      private def model_client
        ::Google::Cloud::AIPlatform::V1::ModelService::Client.new
      end

      private def model_external_id
        deployed_model.model.split('/').last
      end

      private def parent
        "projects/#{VERTEX_AI_PROJECT_ID}/locations/#{VERTEX_AI_LOCATION}"
      end
    end
  end
end
