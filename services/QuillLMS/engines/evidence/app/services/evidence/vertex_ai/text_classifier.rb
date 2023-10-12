# frozen_string_literal: true

module Evidence
  module VertexAI
    class TextClassifier < ApplicationService
      CONFIDENCES = 'confidences'
      DISPLAY_NAMES = 'displayNames'
      PREDICT_API_TIMEOUT = 5.0

      PREDICTION_EXCEPTION_CLASSES = [Google::Cloud::InternalError, Google::Cloud::UnknownError]
      PREDICTION_NUM_RETRIES = 1

      attr_reader :endpoint_external_id, :text

      def initialize(endpoint_external_id, text)
        @endpoint_external_id = endpoint_external_id
        @text = text
      end

      def run
        [top_score_label, top_score]
      end

      private def confidences
        prediction[CONFIDENCES]
          .list_value
          .values
          .map(&:number_value)
      end

      private def client
        ::Google::Cloud::AIPlatform::V1::PredictionService::Client.new do |config|
          config.timeout = PREDICT_API_TIMEOUT
        end
      end

      private def endpoint
        "projects/#{VERTEX_AI_PROJECT_ID}/locations/#{VERTEX_AI_LOCATION}/endpoints/#{endpoint_external_id}"
      end

      private def instances
        [::Google::Protobuf::Value.new(struct_value: { fields: { content: { string_value: text } } })]
      end

      private def prediction
        prediction_response
          .predictions
          .first
          .struct_value
          .fields
      end

      private def prediction_response
        retry_with_exceptions(PREDICTION_NUM_RETRIES, PREDICTION_EXCEPTION_CLASSES) do
          client.predict(endpoint: endpoint, instances: instances)
        end
      end

      private def top_score
        confidences.max
      end

      private def top_score_label
        prediction[DISPLAY_NAMES]
          .list_value
          .values[top_score_index]
          .string_value
      end

      private def top_score_index
        confidences
          .each_with_index
          .max_by { |score, i| [score, i] }
          .last
      end

      private def retry_with_exceptions(max_num_retries, exception_classes)
        num_retries = 0
        begin
          yield
        rescue *exception_classes => e
          num_retries += 1
          retry if num_retries <= max_num_retries

          raise e
        end
      end
    end
  end
end
