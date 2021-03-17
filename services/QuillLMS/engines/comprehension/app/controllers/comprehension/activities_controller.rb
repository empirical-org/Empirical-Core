require_dependency 'comprehension/application_controller'

module Comprehension
  class ActivitiesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_activity, only: [:show, :update, :destroy, :rules]

    # GET /activities.json
    def index
      @activities = Comprehension::Activity.all.order(:name)

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

    # GET /activities/1/rules.json
    def rules
      render json: @activity.prompts&.map {|p| p.rules}&.flatten&.uniq
    end

    private def set_activity
      @activity = Comprehension::Activity.find(params[:id])
    end

    private def activity_params
      params.require(:activity).permit(
        :title,
        :name,
        :parent_activity_id,
        :target_level,
        :scored_level,
        passages_attributes: [:id, :text, :image_link, :image_alt_text],
        prompts_attributes: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback]
      )
    end
  end
end
