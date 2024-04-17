# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class OptimalAndSubOptimalResultsBuilder < ApplicationService
        attr_reader :llm_feedbacks

        OPTIMAL = 0
        SUB_OPTIMAL = 1

        def initialize(llm_feedbacks)
          @llm_feedbacks = llm_feedbacks
        end

        def run = { accuracy:, confusion_matrix: }

        private def accuracy
          return nil if llm_feedbacks.empty?

          1.0 * (confusion_matrix[OPTIMAL][OPTIMAL] + confusion_matrix[SUB_OPTIMAL][SUB_OPTIMAL]) / llm_feedbacks.size
        end

        # results is a 2x2 matrix where
        # rows represent the ground truth (optimal or suboptimal),
        # columns represent the model prediction (optimal or suboptimal),
        private def confusion_matrix
          @confusion_matrix ||= begin
            [[0, 0], [0, 0]].tap do |matrix|
              llm_feedbacks.each do |llm_feedback|
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
