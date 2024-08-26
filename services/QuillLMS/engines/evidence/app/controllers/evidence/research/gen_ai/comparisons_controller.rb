# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ComparisonsController < ApplicationController
        def show
          @comparison = Comparison.find(params[:id])
          @dataset = @comparison.dataset
          @trials = @comparison.trials.includes(:llm, llm_prompt: :llm_prompt_template, llm_examples: :test_example).order(id: :asc)

          @test_examples = @trials.first.dataset.test_examples

          @llm_examples_map =
            LLMExample
              .where(trial: @trials, test_example: @test_examples)
              .includes(:test_example)
              .group_by { |le| [le.trial_id, le.test_example_id] }
        end

        def create
          @comparison = dataset.comparisons.new

          if @comparison.save
            @comparison.trial_comparisons.create!(trial_ids.map { |trial_id| { trial_id: } })
            redirect_to research_gen_ai_dataset_comparison_path(dataset_id: dataset.id, id: @comparison.id)
          else
            redirect_to dataset
          end
        end

        private def dataset = @dataset ||= Dataset.find(params[:dataset_id])

        private def comparison_params = params.permit(trial_ids: [])

        private def trial_ids = comparison_params[:trial_ids]
      end
    end
  end
end
