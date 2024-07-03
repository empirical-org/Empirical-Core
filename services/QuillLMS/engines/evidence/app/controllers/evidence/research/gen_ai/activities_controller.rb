# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ActivitiesController < ApplicationController
        def index = @activities = Activity.all

        def new = @activity = Activity.new

        def create
          @activity = Activity.new(activity_params)

          if @activity.save
            redirect_to new_research_gen_ai_trial_path
          else
            render :new
          end
        end

        def show = @activity = Activity.find(params[:id])

        private def activity_params
          params
            .require(:research_gen_ai_activity)
            .permit(:name, :text)
        end
      end
    end
  end
end
