# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class TrialRunnerCallback
        def on_complete(_status, options)
          trial = Trial.find(options['trial_id'])
          trial.set_trial_duration
          CalculateResultsWorker.perform_async(options['trial_id'])
          trial.set_status
        end
      end
    end
  end
end
