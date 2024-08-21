# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RunGEvalWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 3, queue: 'low'

        def perform(trial_id, g_eval_id, llm_example_id)
          GEvalScore.create!(
            trial_id:,
            g_eval_id:,
            llm_example_id:,
            score: GEvalRunner.run(g_eval_id:, llm_example_id:)&.to_f
          )
        end
      end
    end
  end
end
