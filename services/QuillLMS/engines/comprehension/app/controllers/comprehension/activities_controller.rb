require_dependency 'comprehension/application_controller'

module Comprehension
  class ActivitiesController < ApplicationController
    before_action :set_activity, only: [:show, :update, :destroy]

    # GET /activities.json
    def index
      @activities = Comprehension::Activity.all

      render json: @activities
    end

    # GET /activities/1.json
    def show
      render json: @activity
    end

    # POST /activities.json
    def create
      @activity = Comprehension::Activity.new(activity_params)

      if @activity.save
        render json: @activity, status: :created
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /activities/1.json
    def update
      if @activity.update(activity_params)
        head :no_content
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # DELETE /activities/1.json
    def destroy
      @activity.destroy
      head :no_content
    end

    private def set_activity
      @activity = Comprehension::Activity.find(params[:id])
    end

    private def activity_params
      params.require(:activity).permit(
        :title,
        :parent_activity_id,
        :target_level,
        :scored_level,
        passages_attributes: [:id, :text],
        prompts_attributes: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback, :plagiarism_text, :plagiarism_first_feedback, :plagiarism_second_feedback]
      )
    end
  end
end
