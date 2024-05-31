# frozen_string_literal: true

module Evidence
  module VertexAI
    class ModelClient < Client
      ANNOTATION_SPECS = 'annotationSpecs'
      DISPLAY_NAME = 'displayName'
      CONFUSION_MATRIX = 'confusionMatrix'

      SERVICE_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::ModelService::Client

      def list_labels(deployed_model:)
        service_client
          .list_model_evaluations(parent: deployed_model.model)
          .first
          .to_h
          .dig(:metrics, :struct_value, :fields, CONFUSION_MATRIX, :struct_value, :fields, ANNOTATION_SPECS, :list_value, :values)
          .map { |v| v.dig(:struct_value, :fields, DISPLAY_NAME, :string_value) }
          .flatten
          .reject(&:empty?)
          .uniq
      end
    end
  end
end
