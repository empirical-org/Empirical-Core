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

    activity_sessions.map { |activity_session| format_activity_sessions_for_tooltip(activity_session) }
  end

  private def format_activity_sessions_for_tooltip(activity_session)
    unit_activity = UnitActivity.find_by(unit: activity_session.unit, activity: activity_session.activity)

    questions = activity_session.concept_results.group_by { |cr| cr.question_number }

    key_target_skill_concepts = questions.map { |key, question| get_key_target_skill_concept_for_question(question) }

    correct_key_target_skill_concepts = key_target_skill_concepts.filter { |ktsc| ktsc[:correct] }

    {
      id: activity_session.id,
      percentage: activity_session.percentage,
      description: activity_session.activity.description,
      due_date: unit_activity.due_date,
      completed_at: activity_session.completed_at.to_i + current_user.utc_offset.seconds,
      grouped_key_target_skill_concepts: format_grouped_key_target_skill_concepts(key_target_skill_concepts),
      number_of_questions: questions.length,
      number_of_correct_questions: correct_key_target_skill_concepts.length
    }
  end

  private def format_grouped_key_target_skill_concepts(key_target_skill_concepts)
    key_target_skill_concepts
      .group_by { |ktsc| ktsc[:name] }
      .map do |key, key_target_skill_group|
        {
          name: key_target_skill_group.first[:name],
          correct: key_target_skill_group.filter { |ktsc| ktsc[:correct] }.length,
          incorrect: key_target_skill_group.filter { |ktsc| ktsc[:correct] == false }.length,
        }
      end
  end

  private def authorize!
    return unless params[:classroom_unit_id].present?

    classroom_unit = ClassroomUnit.includes(:classroom).find(params[:classroom_unit_id])
    classroom_teacher!(classroom_unit.classroom_id)
  end

end
