# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class CalculateResultsWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 3, queue: 'gen_ai_eval'

        def perform(trial_id)
          start_time = Time.zone.now

          return if ENV.fetch('STOP_ALL_GEN_AI_TRIALS', 'false') == 'true'

          trial = Trial.find(trial_id)
          trial.update_results(ResultsFetcher.run(trial))
          trial&.update!(evaluation_duration: Time.zone.now - start_time)
        end
      end
    end
  end
end
