module ResultsSummary
  extend ActiveSupport::Concern

  NOT_PRESENT = 'Not present'
  NOT_CORRECT = 'Not correct'
  FULLY_CORRECT = 'Fully correct'
  PARTIALLY_CORRECT = 'Partially correct'

  NO_PROFICIENCY = 'No proficiency'
  PARTIAL_PROFICIENCY = 'Partial proficiency'
  PROFICIENCY = 'Proficiency'

  extend self

  def results_summary(current_user, activity_id, classroom_id, unit_id)
    @current_user = current_user
    activity = Activity.find(activity_id)
    @skill_groups = activity.skill_groups
    set_activity_sessions_and_assigned_students(activity_id, classroom_id, unit_id)
    @skill_group_summaries = @skill_groups.map do |skill_group|
      {
        name: skill_group.name,
        description: skill_group.description,
        not_yet_proficient_student_names: []
      }
    end

    {
      student_results: student_results,
      skill_group_summaries: @skill_group_summaries
    }
  end

  private def set_activity_sessions_and_assigned_students(activity_id, classroom_id, unit_id)
    if unit_id
      classroom_unit = ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
      @assigned_students = User.where(id: classroom_unit.assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession.where(classroom_unit: classroom_unit, state: 'finished')
    else
      unit_ids = @current_user.units.joins("JOIN unit_activities ON unit_activities.activity_id = #{activity_id}")
      classroom_units = ClassroomUnit.where(unit_id: unit_ids, classroom_id: classroom_id)
      assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
      @assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
      @activity_sessions = ActivitySession.where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished').order(completed_at: :desc).uniq { |activity_session| activity_session.user_id }
    end
  end

  private def student_results
    @assigned_students.map do |assigned_student|
      activity_session = @activity_sessions.find { |as| as.user_id == assigned_student.id }
      if activity_session
        {
          name: assigned_student.name,
          id: assigned_student.id,
          skill_groups: skill_groups_for_session(@skill_groups, activity_session.id, assigned_student.name)
        }
      else
        { name: assigned_student.name }
      end
    end
  end

  private def data_for_skill_by_activity_session(activity_session_id, skill)
    concept_results = ConceptResult.where(activity_session_id: activity_session_id, concept_id: [skill.concept_ids])
    number_correct = concept_results.select(&:correct?).length
    number_incorrect = concept_results.select { |cr| !cr.correct? }.length
    {
      skill: skill.name,
      number_correct: number_correct,
      number_incorrect: number_incorrect,
      summary: summarize_correct_skills(number_correct, number_incorrect)
    }
  end

  private def summarize_correct_skills(number_correct, number_incorrect)
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

  private def skill_groups_for_session(skill_groups, activity_session_id, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.skills.map { |skill| data_for_skill_by_activity_session(activity_session_id, skill) }
      present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == NOT_PRESENT ? 0 : 1 }
      correct_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == FULLY_CORRECT ? 1 : 0 }
      proficiency_text = summarize_student_proficiency(present_skill_number, correct_skill_number)
      unless proficiency_text == PROFICIENCY
        skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
        @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].push(student_name)
      end
      {
        skill_group: skill_group.name,
        skills: skills,
        number_of_correct_skills_text: "#{correct_skill_number} of #{present_skill_number} skills correct",
        proficiency_text: proficiency_text,
        id: skill_group.id
      }
    end
  end

  private def summarize_student_proficiency(present_skill_number, correct_skill_number)
    if correct_skill_number == 0
      NO_PROFICIENCY
    elsif present_skill_number == correct_skill_number
      PROFICIENCY
    else
      PARTIAL_PROFICIENCY
    end
  end

end
