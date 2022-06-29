# frozen_string_literal: true

module DiagnosticReports
  extend ActiveSupport::Concern

  NOT_PRESENT = 'Not present'
  NOT_CORRECT = 'Not correct'
  FULLY_CORRECT = 'Fully correct'
  PARTIALLY_CORRECT = 'Partially correct'

  NO_PROFICIENCY = 'No proficiency'
  PARTIAL_PROFICIENCY = 'Partial proficiency'
  PROFICIENCY = 'Proficiency'
  GAINED_PROFICIENCY = 'Gained proficiency'
  MAINTAINED_PROFICIENCY = 'Maintained proficiency'

  def data_for_skill_by_activity_session(all_concept_results, skill)
    concept_results = all_concept_results.select {|cr| cr.concept_id.in?(skill.concept_ids)}
    number_correct = concept_results.select(&:correct?).length
    number_incorrect = concept_results.reject(&:correct?).length
    {
      id: skill.id,
      skill: skill.name,
      number_correct: number_correct,
      number_incorrect: number_incorrect,
      summary: summarize_correct_skills(number_correct, number_incorrect)
    }
  end

  def summarize_correct_skills(number_correct, number_incorrect)
    if number_correct == 0 && number_incorrect == 0
      NOT_PRESENT
    elsif number_correct == 0
      NOT_CORRECT
    elsif number_incorrect == 0
      FULLY_CORRECT
    else
      PARTIALLY_CORRECT
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id=nil, hashify_activity_sessions: false)
    if unit_id
      classroom_unit = ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
      @assigned_students = User.where(id: classroom_unit.assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession
        .includes(:old_concept_results, activity: {skills: :concepts})
        .where(classroom_unit: classroom_unit, is_final_score: true, user_id: classroom_unit.assigned_student_ids, activity_id: activity_id)
    else
      classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
      assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
      @assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession
        .includes(:old_concept_results, activity: {skills: :concepts})
        .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, is_final_score: true, user_id: assigned_student_ids)
        .order(completed_at: :desc)
        .uniq { |activity_session| activity_session.user_id }
    end

    return unless hashify_activity_sessions

    @activity_sessions = @activity_sessions.map { |session| [session.user_id, session] }.to_h
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def set_pre_test_activity_sessions_and_assigned_students(activity_id, classroom_id, hashify_activity_sessions: false)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @pre_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @pre_test_activity_sessions = ActivitySession
      .includes(:old_concept_results, activity: {skills: :concepts})
      .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: assigned_student_ids)
      .order(completed_at: :desc)
      .uniq { |activity_session| activity_session.user_id }

    return unless hashify_activity_sessions

    @pre_test_activity_sessions = @pre_test_activity_sessions.map { |session| [session.user_id, session] }.to_h
  end

  private def set_post_test_activity_sessions_and_assigned_students(activity_id, classroom_id, hashify_activity_sessions: false)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @post_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @post_test_activity_sessions = ActivitySession
      .includes(:old_concept_results, activity: :skills)
      .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: assigned_student_ids)
      .order(completed_at: :desc)
      .uniq { |activity_session| activity_session.user_id }

    return unless hashify_activity_sessions

    @post_test_activity_sessions = @post_test_activity_sessions.map { |session| [session.user_id, session] }.to_h
  end

  private def summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
    case correct_skill_number
    when 0
      NO_PROFICIENCY
    when present_skill_number
      PROFICIENCY
    else
      PARTIAL_PROFICIENCY
    end
  end

end
