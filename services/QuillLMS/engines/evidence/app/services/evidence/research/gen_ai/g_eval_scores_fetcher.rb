# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GEvalScoresFetcher < ApplicationService
        attr_reader :trial, :llm_example_ids

        def initialize(trial)
          @trial = trial
          @llm_example_ids = trial.llm_examples.pluck(:id)
        end

        def run
          batch = Sidekiq::Batch.new
          batch.on(:complete, GEvalScoresFetcherCallback, trial_id: trial.id, llm_example_ids:)

          batch.jobs do
            trial.g_eval_ids&.each do |g_eval_id|
              llm_example_ids.each do |llm_example_id|
                RunGEvalWorker.perform_async(trial.id, g_eval_id, llm_example_id)
              end
            end
          end
        end
      end
    end
  end
end
