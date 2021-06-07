require_dependency 'comprehension/application_controller'

module Comprehension
  class ActivitiesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_activity, only: [:show, :update, :destroy, :rules]

    # GET /activities.json
    def index
      @activities = Comprehension::Activity.joins("LEFT JOIN activities ON comprehension_activities.parent_activity_id = activities.id").where("parent_activity_id IS NULL OR NOT 'archived' = ANY(activities.flags)").order(:name)

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
        @activity.log_creation(lms_user_id)
        render json: @activity, status: :created
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /activities/1.json
    def update
      if @activity.update(activity_params)
        changed_passages = activity_params[:passages_attributes].select {|p| p[:text].present? }
        changed_passages.each do |cp|
          Comprehension::Passage.find(cp[:id]).log_update(lms_user_id)
        end
        head :no_content
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # DELETE /activities/1.json
    def destroy
      @activity.log_deletion(lms_user_id)
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
