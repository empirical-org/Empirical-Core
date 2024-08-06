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
              row = llm_example.test_optimal? ? OPTIMAL : SUBOPTIMAL
              column = llm_example.optimal? ? OPTIMAL : SUBOPTIMAL

              matrix[row][column] += 1
            end
          end
        end
      end
    end
  end
end
