# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class PromptExamplesController < ApplicationController
        def show
          @comparison = Comparison.find(params[:id])
          @trials = @comparison.trials.order(id: :asc)
          @test_examples = @trials.first.dataset.test_examples
        end

        def new = @prompt_example = dataset.prompt_examples.new

        def create
          @prompt_example = dataset.prompt_examples.new(prompt_example_params)

          if @prompt_example.save
            redirect_to dataset
          else
            render :new
          end
        end

        private def dataset = @dataset ||= Dataset.find(params[:dataset_id])

        private def prompt_example_params
          params
            .require(:research_gen_ai_prompt_example)
            .permit(
              :automl_label,
              :automl_primary_feedback,
              :automl_secondary_feedback,
              :curriculum_assigned_status,
              :curriculum_label,
              :curriculum_proposed_feedback,
              :highlight,
              :student_response
            )
        end
      end
    end
  end
end
