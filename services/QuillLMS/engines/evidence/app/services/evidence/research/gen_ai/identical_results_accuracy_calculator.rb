# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class IdenticalResultsAccuracyCalculator < ApplicationService
        attr_reader :experiment, :num_feedbacks

        def initialize(experiment)
          @experiment = experiment
          @num_feedbacks = experiment.llm_feedbacks.size
        end

        def run
          return nil if num_feedbacks.zero?

          1.0 * num_identical_feedbacks / num_feedbacks
        end

        private def num_identical_feedbacks = experiment.llm_feedbacks.select(&:identical_feedback?).size
      end
    end
  end
end
