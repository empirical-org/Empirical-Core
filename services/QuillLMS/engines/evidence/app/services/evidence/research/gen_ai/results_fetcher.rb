# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ResultsFetcher < ApplicationService
        include HTTParty

        BASE_URI = EVAL_API_BASE_URI
        ENDPOINT = "#{BASE_URI}/metrics"
        TIMEOUT = 5.minutes.to_i

        base_uri BASE_URI

        attr_reader :llm_feedbacks, :predictions, :references

        def initialize(llm_feedbacks)
          @llm_feedbacks = llm_feedbacks
          @predictions = llm_feedbacks.map(&:text)
          @references = llm_feedbacks.map(&:example_feedback).map(&:text)
        end

        def run
          {
            accuracy_identical:,
            accuracy_optimal_sub_optimal: optimal_and_sub_optimal_results[:accuracy],
            confusion_matrix: optimal_and_sub_optimal_results[:confusion_matrix],
            misc_metrics:
          }
        end

        private def accuracy_identical
          return nil if llm_feedbacks.empty?

          1.0 * llm_feedbacks.select(&:identical_feedback?).size / llm_feedbacks.size
        end

        private def optimal_and_sub_optimal_results
          @optimal_and_sub_optimal_results ||= OptimalAndSubOptimalResultsBuilder.run(llm_feedbacks)
        end

        private def misc_metrics = self.class.post(ENDPOINT, body:, headers:, timeout: TIMEOUT)

        private def body = { predictions:, references: }.to_json

        private def headers = { "Content-Type" => "application/json", "Authorization" => "Bearer #{EVAL_API_KEY}" }
      end
    end
  end
end
