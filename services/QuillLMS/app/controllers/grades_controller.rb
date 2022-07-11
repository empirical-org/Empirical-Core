# frozen_string_literal: true

class GradesController < ApplicationController

  before_action :authorize!, only: [:tooltip]

  def index
    render json: { grades: Classroom::GRADES }
  end

  def tooltip
    render json: {concept_results: tooltip_query, scores: tooltip_scores_query}.to_json
  end

  private def tooltip_params
    params.permit(:classroom_unit_id, :user_id, :completed, :activity_id)
  end

  private def tooltip_query
    # TODO(upgrade) Use ActiveRecord::Sanitization.sanitize_sql_for_conditions
    return unless tooltip_params['completed']

    RawSqlRunner.execute(
      <<-SQL
        SELECT
          old_concept_results.metadata,
          activities.description,
          concepts.name,
          activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds' AS completed_at,
          unit_activities.due_date
        FROM activity_sessions
        LEFT JOIN old_concept_results
          ON old_concept_results.activity_session_id = activity_sessions.id
        LEFT JOIN concepts
          ON old_concept_results.concept_id = concepts.id
        JOIN classroom_units
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN activities
          ON activities.id = activity_sessions.activity_id
        JOIN unit_activities
          ON activities.id = unit_activities.activity_id
          AND unit_activities.unit_id = classroom_units.unit_id
        WHERE activity_sessions.classroom_unit_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:classroom_unit_id].to_i)}
          AND activity_sessions.user_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:user_id].to_i)}
          AND activity_sessions.activity_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:activity_id].to_i)}
          AND activity_sessions.is_final_score IS true
          AND activity_sessions.visible
      SQL
    ).to_a
  end

  private def tooltip_scores_query
    # activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds' AS completed_at
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          activity_sessions.percentage,
          activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds' AS completed_at
        FROM activity_sessions
        WHERE activity_sessions.classroom_unit_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:classroom_unit_id].to_i)}
          AND activity_sessions.user_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:user_id].to_i)}
          AND activity_sessions.activity_id = #{ActiveRecord::Base.connection.quote(tooltip_params[:activity_id].to_i)}
          AND (activity_sessions.percentage IS NOT NULL
            OR activity_sessions.state = 'finished'
          )
          AND activity_sessions.visible
        ORDER BY activity_sessions.completed_at
      SQL
    ).to_a
  end

  private def authorize!
    return unless params[:classroom_unit_id].present?

    classroom_unit = ClassroomUnit.includes(:classroom).find(params[:classroom_unit_id])
    classroom_teacher!(classroom_unit.classroom_id)
  end

end
