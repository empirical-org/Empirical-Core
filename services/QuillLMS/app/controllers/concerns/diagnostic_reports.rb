# frozen_string_literal: true

module DiagnosticReports
  include GetScoreForQuestion
  extend ActiveSupport::Concern

  NOT_PRESENT = 'Not present'
  NOT_CORRECT = 'Not correct'
  FULLY_CORRECT = 'Fully correct'
  PARTIALLY_CORRECT = 'Partially correct'

  NO_PROFICIENCY = 'No Proficiency'
  PARTIAL_PROFICIENCY = 'Partial Proficiency'
  PROFICIENCY = 'Full Proficiency'
  GAINED_PROFICIENCY = 'Gained Full Proficiency'
  GAINED_SOME_PROFICIENCY = 'Gained Some Proficiency'
  MAINTAINED_PROFICIENCY = 'Maintained Proficiency'
  GAINED_PROFICIENCY_TEXTS = [GAINED_PROFICIENCY, GAINED_SOME_PROFICIENCY]
  FULL_OR_MAINTAINED_PROFICIENCY_TEXTS = [GAINED_PROFICIENCY, MAINTAINED_PROFICIENCY]

  def data_for_question_by_activity_session(all_concept_results, diagnostic_question_skill)
    return {} if all_concept_results.any? { |cr| cr.extra_metadata.nil? }

    concept_results = all_concept_results.select { |cr| cr.extra_metadata['question_uid'] == diagnostic_question_skill.question.uid }

    return nil if concept_results.empty?

    optimal = get_score_for_question(concept_results) > 0
    number_correct = optimal ? 1 : 0
    number_incorrect = optimal ? 0 : 1

    {
      id: diagnostic_question_skill.id,
      name: diagnostic_question_skill.name,
      number_correct: number_correct,
      number_incorrect: number_incorrect,
      proficiency_score: calculate_proficiency_score(number_correct, number_incorrect),
      summary: summarize_correct_skills(number_correct, number_incorrect)
    }
  end

  def calculate_proficiency_score(number_correct, number_incorrect)
    return NOT_PRESENT if number_correct == 0 && number_incorrect == 0

    number_incorrect.zero? ? 1 : 0
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

  def set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id=nil, hashify_activity_sessions: false)
    if unit_id
      classroom_unit = ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
      @assigned_students = User.where(id: classroom_unit.assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession
        .includes(:concept_results, activity: {diagnostic_question_skills: :question})
        .where(classroom_unit: classroom_unit, is_final_score: true, user_id: classroom_unit.assigned_student_ids, activity_id: activity_id)
    else
      classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
      assigned_student_ids = assigned_student_ids_filtered_by_classroom_roster(classroom_units)
      @assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession
        .includes(:concept_results, activity: {diagnostic_question_skills: :question})
        .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, is_final_score: true, user_id: assigned_student_ids)
        .order(completed_at: :desc)
        .uniq { |activity_session| activity_session.user_id }
    end

    return unless hashify_activity_sessions

    @activity_sessions = @activity_sessions.to_h { |session| [session.user_id, session] }
  end

  private def assigned_student_ids_filtered_by_classroom_roster(classroom_units)
    classroom_id = classroom_units.first&.classroom_id
    return [] unless classroom_id

    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    rostered_student_ids = Classroom.find(classroom_id).students.pluck(:id)
    assigned_student_ids.intersection(rostered_student_ids)
  end

  private def set_pre_test_activity_sessions_and_assigned_students(activity_id, classroom_id, hashify_activity_sessions: false)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @pre_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @pre_test_activity_sessions = ActivitySession
      .includes(:concept_results, activity: {diagnostic_question_skills: :question})
      .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: assigned_student_ids)
      .order(completed_at: :desc)
      .uniq { |activity_session| activity_session.user_id }

    return unless hashify_activity_sessions

    @pre_test_activity_sessions = @pre_test_activity_sessions.to_h { |session| [session.user_id, session] }
  end

  private def set_post_test_activity_sessions_and_assigned_students(activity_id, classroom_id, hashify_activity_sessions: false)
    classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @post_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @post_test_activity_sessions = ActivitySession
      .includes(:concept_results, activity: :diagnostic_question_skills)
      .where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: assigned_student_ids)
      .order(completed_at: :desc)
      .uniq { |activity_session| activity_session.user_id }

    return unless hashify_activity_sessions

    @post_test_activity_sessions = @post_test_activity_sessions.to_h { |session| [session.user_id, session] }
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
