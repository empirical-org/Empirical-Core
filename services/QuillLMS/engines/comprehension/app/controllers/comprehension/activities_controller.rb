module Comprehension
  class ActivitiesController < ApplicationController
    before_action :set_activity, only: [:show, :update, :destroy]

    # GET /activities.json
    def index
      @activities = Activity.all

      render json: @activities
    end

    # GET /activities/1.json
    def show
      render json: @activity
    end

    # POST /activities.json
    def create
      @activity = Activity.new(activity_params)

      if @activity.save
        render json: @activity, status: :created, location: @activity
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
      @activity = Activity.find(params[:id])
    end

    private def activity_params
      params.require(:activity).permit(:title, :quill_activity_id, :target_level, :scored_level)
    end
  end
end
