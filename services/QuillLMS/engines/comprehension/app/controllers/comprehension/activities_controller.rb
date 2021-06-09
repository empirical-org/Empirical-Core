require_dependency 'comprehension/application_controller'

module Comprehension
  class ActivitiesController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :set_activity, only: [:show, :update, :destroy, :rules]
    before_action :save_nested_vars_for_log, only: [:update, :create]

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
        log_nested_changes
        render json: @activity, status: :created
      else
        render json: @activity.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /activities/1.json
    def update
      if @activity.update(activity_params)
        log_nested_changes
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

    private def save_nested_vars_for_log
      @prompts_vars = []
      @passages_vars = []
      activity_params[:passages_attributes]&.each do |pa|
        @passages_vars.push({id: pa[:id], text: Comprehension::Passage.find_by_id(pa[:id])&.text || pa[:text]}) if pa[:text]
      end
      activity_params[:prompts_attributes]&.each do |pp|
        @prompts_vars.push({id: pp[:id], text: Comprehension::Prompt.find_by_id(pp[:id])&.text || pp[:text]}) if pp[:text]
      end
    end

    private def log_nested_changes
      @prompts_vars.each do |pv|
        if pv[:id]
          Comprehension::Prompt.find(pv[:id]).log_update(lms_user_id, pv[:text])
        else
          Comprehension::Prompt.find_by(text: pv[:text])&.log_update(lms_user_id, nil)
        end
      end
      @passages_vars.each do |pp|
        if pp[:id]
          Comprehension::Passage.find(pp[:id]).log_update(lms_user_id, pp[:text])
        else
          Comprehension::Passage.find_by(text: pp[:text])&.log_update(lms_user_id, nil)
        end
      end
    end
  end
end
