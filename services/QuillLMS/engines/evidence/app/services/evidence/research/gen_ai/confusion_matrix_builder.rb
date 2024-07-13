# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ConfusionMatrixBuilder < ApplicationService
        attr_reader :llm_examples

        OPTIMAL = 0
        SUBOPTIMAL = 1

        def initialize(llm_examples)
          @llm_examples = llm_examples
        end

        # results is a 2x2 matrix where
        # rows represent the ground truth (optimal or suboptimal),
        # columns represent the model prediction (optimal or suboptimal),
        def run
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
