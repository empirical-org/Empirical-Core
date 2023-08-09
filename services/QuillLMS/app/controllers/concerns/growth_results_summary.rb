# frozen_string_literal: true

module GrowthResultsSummary
  include DiagnosticReports
  extend ActiveSupport::Concern

  extend self

  def growth_results_summary(pre_test_activity_id, post_test_activity_id, classroom_id)
    pre_test = Activity.find(pre_test_activity_id)
    @skill_groups = pre_test.skill_groups
    set_pre_test_activity_sessions_and_assigned_students(pre_test_activity_id, classroom_id, hashify_activity_sessions: true)
    set_post_test_activity_sessions_and_assigned_students(post_test_activity_id, classroom_id, hashify_activity_sessions: true)
    @skill_group_summaries = @skill_groups.map do |skill_group|
      {
        name: skill_group.name,
        description: skill_group.description,
        not_yet_proficient_in_post_test_student_names: [],
        proficiency_scores_by_student: {}
      }
    end

    {
      skill_group_summaries: @skill_group_summaries,
      student_results: student_results
    }
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def student_results
    @post_test_assigned_students.map do |assigned_student|
      post_test_activity_session = @post_test_activity_sessions[assigned_student.id]
      pre_test_activity_session = @pre_test_activity_sessions[assigned_student.id]
      if post_test_activity_session && pre_test_activity_session

        pre_test_concept_results_grouped_by_question = pre_test_activity_session.concept_results.group_by { |cr| cr.question_number }.values

        post_test_concept_results_grouped_by_question = post_test_activity_session.concept_results.group_by { |cr| cr.question_number }.values

        skill_groups = skill_groups_for_session(@skill_groups, post_test_activity_session, pre_test_activity_session, assigned_student.name)

        total_possible_questions_count = post_test_concept_results_grouped_by_question.count
        total_pre_possible_questions_count = pre_test_concept_results_grouped_by_question.count
        total_pre_correct_skill_groups_count = skill_groups.select { |sg| sg[:pre_test_proficiency] == PROFICIENCY }.flatten.uniq.count
        total_correct_skill_groups_count = skill_groups.select { |sg| GROWTH_PROFICIENCY_TEXTS.include?(sg[:proficiency_text]) }.flatten.uniq.count
        total_correct_questions_count = post_test_concept_results_grouped_by_question.reduce(0) { |sum, crs| sum += get_score_for_question(crs) > 0 ? 1 : 0 }
        total_pre_correct_questions_count = pre_test_concept_results_grouped_by_question.reduce(0) { |sum, crs| sum += get_score_for_question(crs) > 0 ? 1 : 0 }
        total_maintained_skill_group_proficiency_count = skill_groups.select{ |skill_group| skill_group[:proficiency_text] == MAINTAINED_PROFICIENCY }.flatten.uniq.count
        {
          name: assigned_student.name,
          id: assigned_student.id,
          skill_groups: skill_groups,
          total_correct_questions_count: total_correct_questions_count,
          total_acquired_skill_groups_count: total_correct_skill_groups_count - total_pre_correct_skill_groups_count,
          total_pre_correct_questions_count: total_pre_correct_questions_count,
          total_possible_questions_count: total_possible_questions_count,
          total_pre_possible_questions_count: total_pre_possible_questions_count,
          total_maintained_skill_group_proficiency_count: total_maintained_skill_group_proficiency_count,
          correct_question_text: "#{total_correct_questions_count} of #{total_possible_questions_count} questions correct",
          correct_skill_groups_text: "#{total_correct_skill_groups_count} of #{skill_groups.count} skill groups"
        }
      else
        { name: assigned_student.name }
      end
    end
  end

  private def skill_groups_for_session(skill_groups, post_test_activity_session, pre_test_activity_session, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.diagnostic_question_skills.map do |diagnostic_question_skill|
        {
          pre: data_for_question_by_activity_session(pre_test_activity_session.concept_results, diagnostic_question_skill),
          post: data_for_question_by_activity_session(post_test_activity_session.concept_results, diagnostic_question_skill)
        }
      end
      format_data_for_skill_group(skill_group, skills, student_name)
    end
  end

  private def format_data_for_skill_group(skill_group, skills, student_name)
    pre_correct_skills = skills.select { |skill| skill[:pre] && skill[:pre][:summary] == FULLY_CORRECT }
    post_correct_skills = skills.select { |skill| skill[:post] && skill[:post][:summary] == FULLY_CORRECT }
    pre_correct_skill_number = pre_correct_skills.count
    pre_present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:pre] && skill[:pre][:summary] != NOT_PRESENT ? 1 : 0 }
    present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:post] && skill[:post][:summary] != NOT_PRESENT ? 1 : 0 }
    correct_skill_number = post_correct_skills.count
    pre_test_proficiency_score = pre_correct_skill_number / pre_present_skill_number.to_f
    post_test_proficiency_score = correct_skill_number / present_skill_number.to_f
    acquired_skills = post_test_proficiency_score > pre_test_proficiency_score
    proficiency_text = summarize_student_proficiency_for_skill_overall(present_skill_number, correct_skill_number, pre_correct_skill_number, acquired_skills)
    skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
    @skill_group_summaries[skill_group_summary_index][:proficiency_scores_by_student][student_name] = { pre: nil, post: nil }
    @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_in_post_test_student_names].push(student_name) unless GROWTH_PROFICIENCY_TEXTS.include?(proficiency_text)
    @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_in_post_test_student_names] =   @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_in_post_test_student_names].uniq
    @skill_group_summaries[skill_group_summary_index][:proficiency_scores_by_student][student_name][:post] = post_test_proficiency_score
    @skill_group_summaries[skill_group_summary_index][:proficiency_scores_by_student][student_name][:pre] = pre_test_proficiency_score
    {
      skill_group: skill_group.name,
      description: skill_group.description,
      skills: skills,
      number_of_correct_questions_text: "#{correct_skill_number} of #{present_skill_number} questions correct",
      proficiency_text: proficiency_text,
      pre_test_proficiency: summarize_student_proficiency_for_skill_per_activity(pre_present_skill_number, pre_correct_skill_number),
      pre_test_proficiency_score: pre_test_proficiency_score,
      post_test_proficiency: summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number),
      post_test_proficiency_score: post_test_proficiency_score,
      id: skill_group.id,
      post_correct_skill_ids: post_correct_skills.map { |s| s[:post][:id] },
      pre_correct_skill_ids: pre_correct_skills.map { |s| s[:pre][:id] },
      skill_ids: skills.map { |s| s[:post] && s[:post][:id] }.compact
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def summarize_student_proficiency_for_skill_overall(present_skill_number, correct_skill_number, pre_correct_skill_number, acquired_skills)
    case correct_skill_number
    when 0
      NO_PROFICIENCY
    when present_skill_number
      correct_skill_number > pre_correct_skill_number ? GAINED_PROFICIENCY : MAINTAINED_PROFICIENCY
    else
      acquired_skills ? GAINED_SOME_PROFICIENCY : PARTIAL_PROFICIENCY
    end
  end

end
