# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ConfusionMatrixBuilder < ApplicationService
        attr_reader :llm_examples, :labels

        def initialize(llm_examples:, labels:)
          @llm_examples = llm_examples
          @labels = labels
        end

        def run
          Array.new(labels.size) { Array.new(labels.size, 0) }.tap do |matrix|
            llm_examples.each do |llm_example|
              predicted_label = llm_example.llm_feedback
              true_label = llm_example.test_example.curriculum_proposed_feedback

              predicted_index = labels.index(predicted_label)
              true_index = labels.index(true_label)

              matrix[true_index][predicted_index] += 1 if predicted_index && true_index
            end
          end
        end
      end
    end
  end
end
