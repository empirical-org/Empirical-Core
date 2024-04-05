# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class OptimalAndSubOptimalResultsBuilder < ApplicationService
        attr_reader :experiment, :num_feedbacks

        OPTIMAL = 0
        SUB_OPTIMAL = 1

        def initialize(experiment)
          @experiment = experiment
          @num_feedbacks = experiment.llm_feedbacks.size
        end

        def run = { accuracy:, confusion_matrix: }

        private def accuracy
          return nil if num_feedbacks.zero?

          1.0 * (confusion_matrix[OPTIMAL][OPTIMAL] + confusion_matrix[SUB_OPTIMAL][SUB_OPTIMAL]) / num_feedbacks
        end

        # results is a 2x2 matrix where
        # rows represent the ground truth (optimal or suboptimal),
        # columns represent the model prediction (optimal or suboptimal),
        private def confusion_matrix
          @confusion_matrix ||= begin
            [[0, 0], [0, 0]].tap do |matrix|
              experiment.llm_feedbacks.each do |llm_feedback|
                if llm_feedback.example_optimal?
                  if llm_feedback.optimal?
                    matrix[OPTIMAL][OPTIMAL] += 1
                  else
                    matrix[OPTIMAL][SUB_OPTIMAL] += 1
                  end
                elsif llm_feedback.optimal?
                  matrix[SUB_OPTIMAL][OPTIMAL] += 1
                else
                  matrix[SUB_OPTIMAL][SUB_OPTIMAL] += 1
                end
              end
            end
          end
        end
      end
    end
  end
end
