# frozen_string_literal: true

module Evidence
  module VertexAI
    class TextClassifier < ApplicationService
      CONFIDENCES = 'confidences'
      DISPLAY_NAMES = 'displayNames'

      PREDICTION_EXCEPTION_CLASSES = [
        Google::Cloud::InternalError,
        Google::Cloud::UnknownError,
        Google::Cloud::DeadlineExceededError
      ].freeze


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


      private def prediction
        @prediction ||=
          prediction_response
            .predictions
            .first
            .struct_value
            .fields
      end

      private def prediction_response
        retry_with_exceptions(PREDICTION_NUM_RETRIES, PREDICTION_EXCEPTION_CLASSES) do
          PredictionClient.new(project:).predict_label_and_score(endpoint_external_id:, text:)
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
