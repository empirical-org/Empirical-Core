# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RunTrialWorker
        include Evidence.sidekiq_module

        sidekiq_options retry: 0, queue: 'low'

        def perform(trial_id)
          return if ENV.fetch('STOP_ALL_GEN_AI_TRIALS', 'false') == 'true'

          Trial.find(trial_id).run
        end
      end
    end
  end
end
