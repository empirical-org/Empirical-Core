module GrowthResultsSummary
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

  extend self

  def growth_results_summary(current_user, pre_test_activity_id, post_test_activity_id, classroom_id)
    @current_user = current_user
    pre_test = Activity.find(pre_test_activity_id)
    @skill_groups = pre_test.skill_groups
    set_pre_test_activity_sessions_and_assigned_students(pre_test_activity_id, classroom_id)
    set_post_test_activity_sessions_and_assigned_students(post_test_activity_id, classroom_id)
    @skill_group_summaries = @skill_groups.map do |skill_group|
      {
        name: skill_group.name,
        description: skill_group.description,
        not_yet_proficient_in_pre_test_student_names: [],
        not_yet_proficient_in_post_test_student_names: []
      }
    end

    {
      student_results: student_results,
      skill_group_summaries: @skill_group_summaries
    }
  end

  private def set_pre_test_activity_sessions_and_assigned_students(activity_id, classroom_id)
    unit_ids = @current_user.units.joins("JOIN unit_activities ON unit_activities.activity_id = #{activity_id}")
    classroom_units = ClassroomUnit.where(unit_id: unit_ids, classroom_id: classroom_id)
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @pre_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @pre_test_activity_sessions = ActivitySession.where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished').order(completed_at: :desc).uniq { |activity_session| activity_session.user_id }
  end

  private def set_post_test_activity_sessions_and_assigned_students(activity_id, classroom_id)
    unit_ids = @current_user.units.joins("JOIN unit_activities ON unit_activities.activity_id = #{activity_id}")
    classroom_units = ClassroomUnit.where(unit_id: unit_ids, classroom_id: classroom_id)
    assigned_student_ids = classroom_units.map { |cu| cu.assigned_student_ids }.flatten.uniq
    @post_test_assigned_students = User.where(id: assigned_student_ids).sort_by { |u| u.last_name }
    @post_test_activity_sessions = ActivitySession.where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished').order(completed_at: :desc).uniq { |activity_session| activity_session.user_id }
  end

  private def student_results
    @post_test_assigned_students.map do |assigned_student|
      post_test_activity_session = @post_test_activity_sessions.find { |as| as.user_id == assigned_student.id }
      pre_test_activity_session = @pre_test_activity_sessions.find { |as| as.user_id == assigned_student.id }
      if post_test_activity_session
        skill_groups = skill_groups_for_session(@skill_groups, post_test_activity_session.id, pre_test_activity_session.id, assigned_student.name)
        total_acquired_skills_count = skill_groups.map { |sg| sg[:acquired_skill_ids] }.flatten.uniq.count
        {
          name: assigned_student.name,
          id: assigned_student.id,
          skill_groups: skill_groups,
          total_acquired_skills_count: total_acquired_skills_count
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
      id: skill.id,
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

  private def skill_groups_for_session(skill_groups, post_test_activity_session_id, pre_test_activity_session_id, student_name)
    skill_groups.map do |skill_group|
      skills = skill_group.skills.map do |skill|
        {
          pre: data_for_skill_by_activity_session(pre_test_activity_session_id, skill),
          post: data_for_skill_by_activity_session(post_test_activity_session_id, skill)
        }
      end
      pre_correct_skills = skills.select { |skill| skill[:pre][:summary] == FULLY_CORRECT }
      post_correct_skills = skills.select { |skill| skill[:post][:summary] == FULLY_CORRECT }
      pre_correct_skill_number = pre_correct_skills.count
      pre_present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:pre][:summary] == NOT_PRESENT ? 0 : 1 }
      present_skill_number = skills.reduce(0) { |sum, skill| sum += skill[:post][:summary] == NOT_PRESENT ? 0 : 1 }
      correct_skill_number = post_correct_skills.count
      proficiency_text = summarize_student_proficiency_for_skill_overall(present_skill_number, correct_skill_number, pre_correct_skill_number)
      post_test_proficiency = summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
      pre_test_proficiency = summarize_student_proficiency_for_skill_per_activity(pre_present_skill_number, pre_correct_skill_number)
      skill_group_summary_index = @skill_group_summaries.find_index { |sg| sg[:name] == skill_group.name }
      @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_in_post_test_student_names].push(student_name) unless post_test_proficiency == PROFICIENCY
      @skill_group_summaries[skill_group_summary_index][:not_yet_proficient_in_pre_test_student_names].push(student_name) unless pre_test_proficiency == PROFICIENCY
      skills_delta = correct_skill_number - pre_correct_skill_number
      puts 'post_correct_skills', post_correct_skills
      puts 'pre_correct_skills', pre_correct_skills
      {
        skill_group: skill_group.name,
        skills: skills,
        number_of_correct_skills_text: "#{correct_skill_number} of #{present_skill_number} skills correct",
        proficiency_text: proficiency_text,
        pre_test_proficiency: pre_test_proficiency,
        post_test_proficiency: post_test_proficiency,
        skills_delta: skills_delta > 0 ? skills_delta : 0,
        id: skill_group.id,
        acquired_skill_ids: post_correct_skills.map { |s| s[:post][:id] } - pre_correct_skills.map { |s| s[:pre][:id] }
      }
    end
  end

  private def summarize_student_proficiency_for_skill_overall(present_skill_number, correct_skill_number, pre_correct_skill_number)
    if correct_skill_number == 0
      NO_PROFICIENCY
    elsif present_skill_number == correct_skill_number
      correct_skill_number > pre_correct_skill_number ? GAINED_PROFICIENCY : MAINTAINED_PROFICIENCY
    else
      PARTIAL_PROFICIENCY
    end
  end

  private def summarize_student_proficiency_for_skill_per_activity(present_skill_number, correct_skill_number)
    if correct_skill_number == 0
      NO_PROFICIENCY
    elsif present_skill_number == correct_skill_number
      PROFICIENCY
    else
      PARTIAL_PROFICIENCY
    end
  end

end
