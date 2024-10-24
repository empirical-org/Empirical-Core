# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class GuidelinesController < ApplicationController
        def new
          @guideline = dataset.guidelines.new
          @curriculum_assigned_statuses = Guideline::ASSIGNED_STATUSES
        end

        def create
          @guideline = dataset.guidelines.new(guideline_params)

          if @guideline.save
            redirect_to @guideline.dataset
          else
            render :new
          end
        end

        def hide
          @guideline = Guideline.find(params[:id])
          @guideline.update(visible: false)
          redirect_to @guideline.dataset
        end

        private def guideline_params
          params
            .require(:research_gen_ai_guideline)
            .permit(:curriculum_assigned_status, :text)
        end

        private def dataset = @dataset ||= Dataset.find(params[:dataset_id])
      end
    end
  end
end
