module ResultsSummary
  include DiagnosticReports
  extend ActiveSupport::Concern

  extend self

  def results_summary(current_user, activity_id, classroom_id, unit_id)
    @current_user = current_user
    activity = Activity.find(activity_id)
    @skill_groups = activity.skill_groups
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(current_user, activity_id, classroom_id, unit_id, true)
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

  private def student_results
    @assigned_students.map do |assigned_student|
      activity_session = @activity_sessions[assigned_student.id]
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

  private def skill_groups_for_session(skill_groups, activity_session_id, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.skills.map { |skill| data_for_skill_by_activity_session(activity_session_id, skill) }
      present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == NOT_PRESENT ? 0 : 1 }
      correct_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == FULLY_CORRECT ? 1 : 0 }
      proficiency_text = summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
      unless proficiency_text == PROFICIENCY
        skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
        @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].push(student_name)
        @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names] = @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].uniq
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

end
