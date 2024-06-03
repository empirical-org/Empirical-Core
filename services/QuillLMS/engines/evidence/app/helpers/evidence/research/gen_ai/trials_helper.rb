# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module TrialsHelper
        def percent_complete(trial) = (trial.llm_feedbacks.count.to_f / trial.num_examples * 100)&.round

        def progress(trial)
          return '100%' if trial.num_examples.zero?

          "#{percent_complete(trial)}% complete (#{trial.llm_feedbacks.count}/#{trial.num_examples})"
        end

        def evaluation_duration(trial)
          "#{trial.evaluation_duration&.round(2)} s"
        end

        def trial_duration(trial)
          return '0 s' if trial.trial_duration.nil? || trial.num_examples.zero?

          duration = trial.trial_duration.round(2)
          "#{duration} s (#{(duration / @trial.num_examples)&.round(2)}s / example)"
        end
      end
    end
  end
end
