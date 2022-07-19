# frozen_string_literal: true

require_dependency 'evidence/application_controller'

module Evidence
  class ActivitiesController < ApiController
    before_action :set_activity, only: [:activity_versions, :create, :show, :update, :destroy, :change_logs]
    append_before_action :set_lms_user_id, only: [:create, :destroy]

    # GET /activities.json
    def index
      @activities = Evidence::Activity.order(:title).map { |a| a.serializable_hash(include: []) }

      render json: @activities
    end

    # GET /activities/1.json
    def show
      render json: @activity
    end

    # POST /activities.json
    def create
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

    def increment_version
      @activity = Evidence::Activity.find(params[:id])
      old_version = @activity.version
      @activity.increment_version!

      changelog_params = {
        action: 'updated',
        changed_record_type: 'Evidence::Activity',
        changed_record_id: @activity.id,
        explanation: increment_version_params,
        changed_attribute: 'version',
        previous_value: old_version,
        new_value: @activity.version
      }
      Evidence.change_log_class.create!(changelog_params)
      head :no_content
    end

    # DELETE /activities/1.json
    def destroy
      @activity.destroy
      head :no_content
    end

    # GET /activities/1/rules.json
    def rules
      @activity = Evidence::Activity.includes(
        prompts: { rules: [:plagiarism_texts, { feedbacks: :highlights }, :label, :regex_rules, :hint, :prompts]}
      ).find(params[:id])
      rules = @activity.prompts&.map {|p| p.rules}&.flatten&.uniq
      render json: rules
    end

    # GET /activities/1/change_logs.json
    def change_logs
      render json: @activity&.change_logs_for_activity || []
    end

    def activity_versions
      render json: @activity&.activity_versions
    end

    private def set_activity
      if params[:id].present?
        @activity = Evidence::Activity.find(params[:id])
      else
        @activity = Evidence::Activity.new(activity_params)
      end
    end

    private def set_lms_user_id
      @activity.lms_user_id = lms_user_id
    end

    private def increment_version_params
      params.require(:note)
    end

    private def activity_params
      params.require(:activity).permit(
        :title,
        :notes,
        :parent_activity_id,
        :target_level,
        :scored_level,
        :flag,
        passages_attributes: [:id, :text, :image_link, :image_alt_text, :image_caption, :image_attribution, :highlight_prompt, :essential_knowledge_text],
        prompts_attributes: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback, :first_strong_example, :second_strong_example]
      )
    end
  end
end
