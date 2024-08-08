# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class CalculateResultsWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 3, queue: 'gen_ai_eval'

        def perform(trial_id)
          return if ENV.fetch('STOP_ALL_GEN_AI_TRIALS', 'false') == 'true'

          trial = Trial.find(trial_id)
          trial.update_results(confusion_matrix: ConfusionMatrixBuilder.run(trial.llm_examples))
          GEvalScoresFetcher.run(trial)
        end
      end
    end
  end
end
