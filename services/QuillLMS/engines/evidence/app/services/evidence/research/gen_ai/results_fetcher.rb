# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ResultsFetcher < ApplicationService
        attr_reader :trial, :llm_examples, :predictions, :references

        def initialize(trial)
          @trial = trial
          @llm_examples = trial.llm_examples
        end

        def run = { confusion_matrix:, g_evals: }

        private def g_evals
          trial.g_eval_ids&.index_with do |g_eval_id|
            llm_examples.map do |llm_example|
              GEvalRunner.run(g_eval_id:, llm_example:)&.to_f
            end
          end
        end

        private def confusion_matrix = @confusion_matrix ||= ConfusionMatrixBuilder.run(llm_examples)
      end
    end
  end
end
