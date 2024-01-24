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
        not_yet_proficient_student_names: [],
        proficiency_scores_by_student: {},
        question_uids: skill_group.questions.pluck(:uid)
      }
    end

    {
      student_results: student_results,
      skill_group_summaries: @skill_group_summaries,
      # @TODO - remove these last three attributes once we work out the bug described in this PR: https://github.com/empirical-org/Empirical-Core/pull/11245
      activity_id: activity_id,
      classroom_id: classroom_id,
      unit_id: unit_id
    }
  end

  private def student_results
    @assigned_students.map do |assigned_student|
      activity_session = @activity_sessions[assigned_student.id]
      if activity_session
        concept_results = activity_session.concept_results
        concept_results_grouped_by_question = concept_results.group_by { |cr| cr.question_number }.values
        skill_groups = skill_groups_for_session(@skill_groups, concept_results, assigned_student.name)
        total_possible_questions_count = concept_results_grouped_by_question.count
        total_correct_questions_count = concept_results_grouped_by_question.reduce(0) { |sum, crs| sum += get_score_for_question(crs) > 0 ? 1 : 0 }
        total_correct_skill_groups_count = skill_groups.select { |sg| sg[:correct_skill_ids].length == sg[:skill_ids].length }.flatten.uniq.count
        {
          name: assigned_student.name,
          id: assigned_student.id,
          skill_groups: skill_groups,
          total_correct_questions_count: total_correct_questions_count,
          total_correct_skill_groups_count: total_correct_skill_groups_count,
          total_possible_questions_count: total_possible_questions_count,
          correct_question_text: "#{total_correct_questions_count} of #{total_possible_questions_count} Questions Correct",
          correct_skill_groups_text: "#{total_correct_skill_groups_count} of #{skill_groups.count} Skills"
        }
      else
        { name: assigned_student.name }
      end
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def skill_groups_for_session(skill_groups, concept_results, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.diagnostic_question_skills.map do |diagnostic_question_skill|
        data_for_question_by_activity_session(concept_results, diagnostic_question_skill)
      end.compact
      present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:summary] == NOT_PRESENT ? 0 : 1 }
      correct_skills = skills.select { |skill| skill[:summary] == FULLY_CORRECT }
      correct_skill_ids = correct_skills.map { |s| s[:id] }
      correct_skill_number = correct_skills.count
      proficiency_text = summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
      average_proficiency_score = skills.reduce(0) do |sum, skill|
        score = skill[:proficiency_score].is_a?(Integer) ? skill[:proficiency_score] : skill[:proficiency_score].to_i
        sum += score
      end / skills.length.to_f

      if @skill_group_summaries
        skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
        @skill_group_summaries[skill_group_summary_index][:proficiency_scores_by_student][student_name] = average_proficiency_score
        unless proficiency_text == PROFICIENCY
          @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].push(student_name)
          @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names] = @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_student_names].uniq
        end
      end

      number_incorrect = present_skill_number - correct_skill_number

      {
        skill_group: skill_group.name,
        description: skill_group.description,
        skills: skills,
        skill_ids: skills.map { |s| s[:id] },
        correct_skill_ids: correct_skill_ids,
        number_of_correct_questions_text: "#{correct_skill_number} of #{present_skill_number} Questions Correct",
        proficiency_text: proficiency_text,
        summary: summarize_correct_skills(correct_skill_number, number_incorrect),
        number_correct: correct_skill_number,
        number_incorrect: number_incorrect,
        id: skill_group.id,
        question_uids: skill_group.questions.pluck(:uid)
      }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
