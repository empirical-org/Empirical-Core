# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module ExperimentsHelper
        def percent_complete(experiment) = (experiment.llm_feedbacks.count.to_f / experiment.num_examples * 100)&.round

        def progress(experiment)
          return '100%' if experiment.num_examples.zero?

          "#{percent_complete(experiment)}% complete (#{experiment.llm_feedbacks.count}/#{experiment.num_examples})"
        end

        def evaluation_duration(experiment)
          "#{experiment.evaluation_duration&.round(2)} s"
        end

        def experiment_duration(experiment)
          return '0 s' if experiment.experiment_duration.nil? || experiment.num_examples.zero?

          duration = experiment.experiment_duration.round(2)
          "#{duration} s (#{(duration / @experiment.num_examples)&.round(2)}s / example)"
        end
      end
    end
  end
end
