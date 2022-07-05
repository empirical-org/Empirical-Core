# frozen_string_literal: true

module ResultsSummary
  include DiagnosticReports
  extend ActiveSupport::Concern

  extend self

  def results_summary(activity_id, classroom_id, unit_id)
    activity = Activity.find(activity_id)
    @skill_groups = activity.skill_groups
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id, hashify_activity_sessions: true)
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
        skill_groups = skill_groups_for_session(@skill_groups, activity_session, assigned_student.name)
        total_possible_skills_count = skill_groups.map { |sg| sg[:skill_ids] }.flatten.uniq.count
        total_correct_skills_count = skill_groups.map { |sg| sg[:correct_skill_ids] }.flatten.uniq.count
        {
          name: assigned_student.name,
          id: assigned_student.id,
          skill_groups: skill_groups,
          total_correct_skills_count: total_correct_skills_count,
          total_possible_skills_count: total_possible_skills_count,
          correct_skill_text: "#{total_correct_skills_count} of #{total_possible_skills_count} skills correct"
        }
      else
        { name: assigned_student.name }
      end
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def skill_groups_for_session(skill_groups, activity_session, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.skills.map { |skill| data_for_skill_by_activity_session(activity_session.old_concept_results, skill) }
      present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == NOT_PRESENT ? 0 : 1 }
      correct_skills = skills.select { |skill| skill[:summary] == FULLY_CORRECT }
      correct_skill_ids = correct_skills.map { |s| s[:id] }
      correct_skill_number = correct_skills.count
      proficiency_text = summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
      unless proficiency_text == PROFICIENCY
        skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
        @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].push(student_name)
        @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names] = @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].uniq
      end
      {
        skill_group: skill_group.name,
        description: skill_group.description,
        skills: skills,
        skill_ids: skills.map { |s| s[:id] },
        correct_skill_ids: correct_skill_ids,
        number_of_correct_skills_text: "#{correct_skill_number} of #{present_skill_number} skills correct",
        proficiency_text: proficiency_text,
        id: skill_group.id
      }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
