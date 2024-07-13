# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module TrialsHelper
        def percent_complete(trial) = (trial.llm_examples.count.to_f / trial.test_examples_count * 100)&.round

        def progress(trial)
          return '100%' if trial.test_examples_count.zero?

          "#{percent_complete(trial)}% complete (#{trial.llm_examples.count}/#{trial.test_examples_count})"
        end

        def evaluation_duration(trial) = "#{trial.evaluation_duration&.round(2)} s"

        def trial_duration(trial)
          return '0 s' if trial.trial_duration.nil? || trial.test_examples_count.zero?

          duration = trial.trial_duration.round(2)
          "#{duration} s (#{(duration / @trial.test_examples_count)&.round(2)}s / example)"
        end
      end
    end
  end
end
