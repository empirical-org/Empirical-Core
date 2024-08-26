# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class TrialRunner < ApplicationService
        attr_reader :trial

        def initialize(trial)
          @trial = trial
        end

        def run
          return unless trial.pending?

          trial.set_trial_start_time
          trial.running!
          query_test_examples
        rescue StandardError => e
          trial.trial_errors << e.message
          trial.failed!
        end

        private def query_test_examples
          batch = Sidekiq::Batch.new
          batch.on(:complete, TrialRunnerCallback, trial_id: trial.id)

          batch.jobs do
            trial.test_examples.each do |test_example|
              BuildLLMExampleWorker.perform_async(trial.id, test_example.id)
            end
          end
        end
      end
    end
  end
end
