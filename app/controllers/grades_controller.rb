class GradesController < ApplicationController

  before_action :authorize!, only: [:tooltip]

  def index
    render json: Classroom::GRADES
  end

  def tooltip
    render json: tooltip_query.to_json
  end

  private

  def tooltip_params
    params.permit(:classroom_activity_id, :user_id)
  end

  def tooltip_query
    # TODO(upgrade) Use ActiveRecord::Sanitization.sanitize_sql_for_conditions
    ActiveRecord::Base.connection.execute(
      "SELECT concept_results.metadata, activities.description, concepts.name, activity_sessions.completed_at, classroom_activities.due_date
        FROM activity_sessions
          JOIN concept_results ON concept_results.activity_session_id = activity_sessions.id
          JOIN concepts ON concept_results.concept_id = concepts.id
          JOIN classroom_activities ON classroom_activities.id = activity_sessions.classroom_activity_id
          JOIN activities ON activities.id = activity_sessions.activity_id
        WHERE activity_sessions.classroom_activity_id = #{ActiveRecord::Base.sanitize(tooltip_params[:classroom_activity_id].to_i)}
          AND activity_sessions.user_id = #{ActiveRecord::Base.sanitize(tooltip_params[:user_id].to_i)}
      ").to_a
  end

  def authorize!
    return unless params[:classroom_activity_id].present?
    classroom_activity = ClassroomActivity.includes(:classroom).find(params[:classroom_activity_id])
    auth_failed unless classroom_activity.classroom.teacher == current_user
  end

end
