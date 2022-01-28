# frozen_string_literal: true

include PublicProgressReports
include DiagnosticReports

module LessonsRecommendations
  extend ActiveSupport::Concern

  def get_recommended_lessons(current_user, unit_id, classroom_id, activity_id)
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id)
    @activity_id = activity_id
    @classroom_id = classroom_id
    @activity_sessions_with_counted_concepts = act_sesh_with_counted_concepts
    recommendations
  end

  def act_sesh_with_counted_concepts
    PublicProgressReports.activity_sessions_with_counted_concepts(@activity_sessions)
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def recommendations
    LessonRecommendationsQuery.new(
      @activity_id,
      @classroom_id
    ).activity_recommendations.map do |lessons_rec|
      fail_count = 0
      students_needing_instruction = []
      @activity_sessions_with_counted_concepts.each do |activity_session|
        lessons_rec[:requirements]&.each do |req|
          if req[:noIncorrect] && activity_session[:concept_scores][req[:concept_id]]["total"] > activity_session[:concept_scores][req[:concept_id]]["correct"]
            fail_count += 1
            students_needing_instruction.push(activity_session[:user_name])
            break
          end
          if activity_session[:concept_scores][req[:concept_id]]["correct"] < req[:count]
            fail_count += 1
            students_needing_instruction.push(activity_session[:user_name])
            break
          end
        end
      end
      students_needing_instruction = students_needing_instruction.sort_by { |name| name.split[-1] }
      return_value_for_lesson_recommendation(lessons_rec, fail_count, students_needing_instruction)
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def return_value_for_lesson_recommendation(lessons_rec, fail_count, students_needing_instruction)
    {
      activity_pack_id: lessons_rec[:activityPackId],
      name: lessons_rec[:recommendation],
      students_needing_instruction: students_needing_instruction,
      percentage_needing_instruction: percentage_needing_instruction(fail_count),
      activities: lessons_rec[:activities],
    }
  end

  def percentage_needing_instruction(fail_count)
    @total_count ||= @activity_sessions.length
    return 0 if @total_count == 0

    ((fail_count.to_f/@total_count)*100).round
  end
end
