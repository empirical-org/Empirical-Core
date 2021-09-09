require_dependency 'evidence/application_controller'

module Evidence
  class ActivitiesController < ApiController
    before_action :set_activity, only: [:create, :show, :update, :destroy, :rules, :change_logs]
    append_before_action :set_lms_user_id, only: [:create, :destroy]

    # GET /activities.json
    def index
      @activities = Evidence::Activity.joins("LEFT JOIN activities ON comprehension_activities.parent_activity_id = activities.id").where("parent_activity_id IS NULL OR NOT 'archived' = ANY(activities.flags)").order(:title)

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

    # DELETE /activities/1.json
    def destroy
      @activity.destroy
      head :no_content
    end

    # GET /activities/1/rules.json
    def rules
      render json: @activity.prompts&.map {|p| p.rules}&.flatten&.uniq
    end

    # GET /activities/1/change_logs.json
    def change_logs
      render json: @activity&.change_logs_for_activity || []
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

    private def activity_params
      params.require(:activity).permit(
        :title,
        :notes,
        :parent_activity_id,
        :target_level,
        :scored_level,
        passages_attributes: [:id, :text, :image_link, :image_alt_text, :image_caption, :image_attribution, :highlight_prompt],
        prompts_attributes: [:id, :conjunction, :text, :max_attempts, :max_attempts_feedback]
      )
    end
  end
end
