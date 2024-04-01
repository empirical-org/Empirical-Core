module Evidence
  module Research
    module GenAI
      class ConfusionMatrixCalculator < ApplicationService
        attr_reader :experiment

        OPTIMAL_LABEL = 'Optimal'
        SUBOPTIMAL_LABEL = 'Suboptimal'

        def initialize(experiment)
          @experiment = experiment
          @results = [[0, 0], [0, 0]]
        end

        def run(experiment)
          experiment.llm_feedbacks.each do |llm_feedback|
          end

          update!(results: results.merge(confusion_matrix: ConfusionMatrixCalculator.run(self)))
        end
      end
    end
  end
end
