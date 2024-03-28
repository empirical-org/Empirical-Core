# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ExampleFeedbacksController < ApplicationController
        before_action :example_feedback, only: %i[show update]

        def show = example_feedback

        def edit = example_feedback

        def update
          if example_feedback.update(edit_example_feedback_params)
            redirect_to example_feedback
          else
            render :edit
          end
        end

        private def example_feedback = @example_feedback ||= ExampleFeedback.find(params[:id])

        private def example_feedback_params = params.require(:research_gen_ai_example_feedback)
        private def edit_example_feedback_params = example_feedback_params.permit(:chain_of_thought, :paraphrase)
      end
    end
  end
end
