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

        attr_reader :trial, :llm_feedbacks, :predictions, :references

        def initialize(trial)
          @trial = trial
          @llm_feedbacks = trial.llm_feedbacks
          @predictions = llm_feedbacks.map(&:text)
          @references = llm_feedbacks.map(&:quill_feedback).map(&:text)
        end

        def run
          {
            accuracy_identical:,
            accuracy_optimal_suboptimal: optimal_and_suboptimal_results[:accuracy],
            confusion_matrix: optimal_and_suboptimal_results[:confusion_matrix],
            g_evals:,
            misc_metrics:
          }
        end

        private def accuracy_identical
          return nil if llm_feedbacks.empty?

          1.0 * llm_feedbacks.select(&:identical_feedback?).size / llm_feedbacks.size
        end

        private def g_evals
          trial.g_eval_ids&.index_with do |g_eval_id|
            llm_feedbacks.map do |llm_feedback|
              GEvalRunner.run(g_eval_id:, llm_feedback:)
            end
          end
        end

        private def optimal_and_suboptimal_results
          @optimal_and_suboptimal_results ||= OptimalAndSuboptimalResultsBuilder.run(llm_feedbacks)
        end

        private def misc_metrics = self.class.post(ENDPOINT, body:, headers:, timeout: TIMEOUT)

        private def body = { predictions:, references: }.to_json

        private def headers = { "Content-Type" => "application/json", "Authorization" => "Bearer #{EVAL_API_KEY}" }
      end
    end
  end
end
