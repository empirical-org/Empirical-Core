# frozen_string_literal: true

module Evidence
  module VertexAI
    class TextClassifier < ApplicationService
      CONFIDENCES = 'confidences'
      DISPLAY_NAMES = 'displayNames'
      PREDICT_API_TIMEOUT = 5.0

      PREDICTION_EXCEPTION_CLASSES = [
        Google::Cloud::InternalError,
        Google::Cloud::UnknownError,
        Google::Cloud::DeadlineExceededError
      ].freeze


      PREDICTION_CLIENT_CLASS = ::Google::Cloud::AIPlatform::V1::PredictionService::Client

      PREDICTION_NUM_RETRIES = 1

      attr_reader :endpoint_external_id, :project, :text

      def initialize(endpoint_external_id:, project:, text:)
        @endpoint_external_id = endpoint_external_id
        @project = project
        @text = text
      end

      def run = [top_score_label, top_score]

      private def confidences
        prediction[CONFIDENCES]
          .list_value
          .values
          .map(&:number_value)
      end

      private def client
        ClientFetcher.run(client_class: PREDICTION_CLIENT_CLASS, project: project) do |config|
          config.timeout = PREDICT_API_TIMEOUT
        end
      end

      private def endpoint = "projects/#{project_id}/locations/#{VERTEX_AI_LOCATION}/endpoints/#{endpoint_external_id}"

      private def project_id = ClientFetcher.project_id(project)

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
          client.predict(endpoint:, instances:)
        end
      end

      private def top_score = confidences.max

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
