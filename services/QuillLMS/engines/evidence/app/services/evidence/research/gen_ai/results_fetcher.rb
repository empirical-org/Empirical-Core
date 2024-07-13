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

        attr_reader :trial, :llm_examples, :predictions, :references

        def initialize(trial)
          @trial = trial
          @llm_examples = trial.llm_examples
          @predictions = llm_examples.map(&:llm_feedback)
          @references = llm_examples.map(&:test_example).map(&:curriculum_proposed_feedback)
        end

        def run
          {
            accuracy_optimal_suboptimal: optimal_and_suboptimal_results[:accuracy],
            confusion_matrix: optimal_and_suboptimal_results[:confusion_matrix],
            g_evals:,
            misc_metrics:
          }
        end

        private def g_evals
          trial.g_eval_ids&.index_with do |g_eval_id|
            llm_examples.map do |llm_example|
              GEvalRunner.run(g_eval_id:, llm_example:)
            end
          end
        end

        private def optimal_and_suboptimal_results
          @optimal_and_suboptimal_results ||= OptimalAndSuboptimalResultsBuilder.run(llm_examples)
        end

        private def misc_metrics = self.class.post(ENDPOINT, body:, headers:, timeout: TIMEOUT)

        private def body = { predictions:, references: }.to_json

        private def headers = { 'Content-Type' => 'application/json', 'Authorization' => "Bearer #{EVAL_API_KEY}" }
      end
    end
  end
end
