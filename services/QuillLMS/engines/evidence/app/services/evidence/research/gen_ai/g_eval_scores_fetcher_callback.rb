# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GEvalScoresFetcherCallback
        def on_complete(status, options)
          trial = Trial.find(options['trial_id'])
          trial.update_results!(g_evals: g_evals(trial, options['llm_example_ids']))
          trial.update!(evaluation_duration: Time.zone.now - Time.zone.parse(trial.evaluation_start_time))
        end

        private def g_evals(trial, llm_example_ids)
          trial.g_eval_ids&.index_with do |g_eval_id|
            llm_example_ids.map do |llm_example_id|
              GEvalScore.find_by(trial_id: trial.id, g_eval_id:, llm_example_id:)&.score
            end
          end
        end
      end
    end
  end
end
