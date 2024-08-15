# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class ActivitiesController < ApplicationController
        def index = @activities = Activity.all.order(created_at: :desc)

        def new = @activity = Activity.new

        def create
          @activity = Activity.new(activity_params)

          if @activity.save
            redirect_to @activity
          else
            render :new
          end
        end

        def show = @activity = Activity.find(params[:id])

        private def activity_params
          params
            .require(:research_gen_ai_activity)
            .permit(:name, :text, :because_text, :but_text, :so_text)
        end
      end
    end
  end
end
