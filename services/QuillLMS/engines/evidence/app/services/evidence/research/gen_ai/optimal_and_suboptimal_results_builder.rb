# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class OptimalAndSuboptimalResultsBuilder < ApplicationService
        attr_reader :llm_examples

        OPTIMAL = 0
        SUBOPTIMAL = 1

        def initialize(llm_examples)
          @llm_examples = llm_examples
        end

        def run = { accuracy:, confusion_matrix: }

        private def accuracy
          return nil if llm_examples.empty?

          1.0 * (confusion_matrix[OPTIMAL][OPTIMAL] + confusion_matrix[SUBOPTIMAL][SUBOPTIMAL]) / llm_examples.size
        end

        # results is a 2x2 matrix where
        # rows represent the ground truth (optimal or suboptimal),
        # columns represent the model prediction (optimal or suboptimal),
        private def confusion_matrix
          @confusion_matrix ||= begin
            [[0, 0], [0, 0]].tap do |matrix|
              llm_examples.each do |llm_example|
                if llm_example.test_optimal?
                  if llm_example.optimal?
                    matrix[OPTIMAL][OPTIMAL] += 1
                  else
                    matrix[OPTIMAL][SUBOPTIMAL] += 1
                  end
                elsif llm_example.optimal?
                  matrix[SUBOPTIMAL][OPTIMAL] += 1
                else
                  matrix[SUBOPTIMAL][SUBOPTIMAL] += 1
                end
              end
            end
          end
        end
      end
    end
  end
end
