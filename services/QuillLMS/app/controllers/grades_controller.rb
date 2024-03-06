# frozen_string_literal: true

class GradesController < ApplicationController
  include PublicProgressReports

  before_action :authorize!, only: [:tooltip]

  def index
    render json: { grades: Classroom::GRADES }
  end

  def tooltip
    render json: { sessions: tooltip_query }.to_json
  end

  private def tooltip_params
    params.permit(:classroom_unit_id, :user_id, :completed, :activity_id)
  end

  private def tooltip_query
    activity_sessions = ActivitySession
      .includes(:concept_results, :activity, :unit)
      .where(
        classroom_unit_id: tooltip_params[:classroom_unit_id].to_i,
        user_id: tooltip_params[:user_id].to_i,
        activity_id: tooltip_params[:activity_id].to_i,
        visible: true,
        state: ActivitySession::STATE_FINISHED
      )
      .order(:completed_at)

    activity_sessions.map { |activity_session| activity_session.format_activity_sessions_for_tooltip(current_user) }
  end

  private def authorize!
    return unless params[:classroom_unit_id].present?

    classroom_unit = ClassroomUnit.includes(:classroom).find(params[:classroom_unit_id])
    classroom_teacher!(classroom_unit.classroom_id)
  end

end
