# frozen_string_literal: true

class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
  include PublicProgressReports
  include LessonsRecommendations
  include DiagnosticReports
  require 'pusher'

  before_action :authorize_teacher!,
    only: [
      :growth_results_summary,
      :lesson_recommendations_for_classroom,
      :previously_assigned_recommendations,
      :question_view,
      :recommendations_for_classroom,
      :results_summary,
      :students_by_classroom
    ]

  def show
    set_banner_variables
    @classroom_id = current_user.classrooms_i_teach&.last&.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(params[:activity_id], params[:classroom_id], params[:unit_id])
    activity = Activity.includes(:classification)
                       .find(params[:activity_id])
    render json: { data: results_by_question(params[:activity_id]),
                   classification: activity.classification.key }.to_json
  end

  def students_by_classroom
    classroom = Classroom.find(params[:classroom_id])
    cache_groups = {
      activity_id: params[:activity_id],
      unit_id: params[:unit_id]
    }
    response = current_user.classroom_cache(classroom, key: 'teachers.progress_reports.diagnostic_reports.student_by_classroom', groups: cache_groups) do
      results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
    end
    render json: response
  end

  def diagnostic_student_responses_index
    activity_id = results_summary_params[:activity_id]
    classroom_id = results_summary_params[:classroom_id]
    unit_id = results_summary_params[:unit_id]

    students_json = current_user.classroom_unit_by_ids_cache(
      classroom_id: classroom_id,
      unit_id: unit_id,
      activity_id: activity_id,
      key: 'diagnostic_reports.diagnostic_student_responses_index'
    ) do
      set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(activity_id, classroom_id, unit_id, hashify_activity_sessions: true)
      diagnostic_student_responses
    end

    render json: { students: students_json }
  end

  def individual_student_diagnostic_responses
    data = fetch_individual_student_diagnostic_responses_cache

    return render json: data, status: 404 if data.empty?

    render json: data
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def fetch_individual_student_diagnostic_responses_cache
    activity_id = individual_student_diagnostic_responses_params[:activity_id]
    classroom_id = individual_student_diagnostic_responses_params[:classroom_id]
    unit_id = individual_student_diagnostic_responses_params[:unit_id]
    student_id = individual_student_diagnostic_responses_params[:student_id]

    cache_groups = {
      student_id: student_id
    }

    current_user.classroom_unit_by_ids_cache(
      classroom_id: classroom_id,
      unit_id: unit_id,
      activity_id: activity_id,
      key: 'diagnostic_reports.individual_student_diagnostic_responses',
      groups: cache_groups
    ) do
      activity_session = find_activity_session_for_student_activity_and_classroom(student_id, activity_id, classroom_id, unit_id)

      if !activity_session
        return {}
      end

      student = User.find_by_id(student_id)
      skills = Activity.find(activity_id).skills.distinct
      pre_test = Activity.find_by_follow_up_activity_id(activity_id)
      pre_test_activity_session = pre_test && find_activity_session_for_student_activity_and_classroom(student_id, pre_test.id, classroom_id, nil)

      if pre_test && pre_test_activity_session
        concept_results = {
          pre: { questions: format_concept_results(pre_test_activity_session, pre_test_activity_session.concept_results.order("question_number::int")) },
          post: { questions: format_concept_results(activity_session, activity_session.concept_results.order("question_number::int")) }
        }
        formatted_skills = skills.map do |skill|
          {
            pre: data_for_skill_by_activity_session(pre_test_activity_session.concept_results, skill),
            post: data_for_skill_by_activity_session(activity_session.concept_results, skill)
          }
        end
        skill_results = { skills: formatted_skills.uniq { |formatted_skill| formatted_skill[:pre][:skill] } }
      else
        concept_results = { questions: format_concept_results(activity_session, activity_session.concept_results.order("question_number::int")) }
        skill_results = { skills: skills.map { |skill| data_for_skill_by_activity_session(activity_session.concept_results, skill) }.uniq { |formatted_skill| formatted_skill[:skill] } }
      end
      { concept_results: concept_results, skill_results: skill_results, name: student.name }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def classrooms_with_students
    render json: fetch_classrooms_with_students_cache
  end

  private def fetch_classrooms_with_students_cache
    cache_groups = {
      unit_id: params[:unit_id],
      activity_id: params[:activity_id]
    }

    current_user.all_classrooms_cache(key: 'teachers.progress_reports.diagnostic_reports.classrooms_with_students', groups: cache_groups) do
      classrooms_with_students_for_report(params[:unit_id], params[:activity_id]).to_json
    end
  end

  def recommendations_for_classroom
    render json: generate_recommendations_for_classroom(current_user, params[:unit_id], params[:classroom_id], params[:activity_id])
  end

  def lesson_recommendations_for_classroom
    lesson_recs = current_user.classroom_unit_by_ids_cache(
      classroom_id: params[:classroom_id],
      unit_id: params[:unit_id],
      activity_id: params[:activity_id],
      key: 'diagnostic_reports.lesson_recommendations_for_classroom'
    ) do
      get_recommended_lessons(current_user, params[:unit_id], params[:classroom_id], params[:activity_id])
    end

    render json: {lessonsRecommendations: lesson_recs}
  end

  def diagnostic_activity_ids
    render json: { diagnosticActivityIds: Activity.diagnostic_activity_ids }
  end

  def activity_with_recommendations_ids
    render json: { activityWithRecommendationsIds: Activity.activity_with_recommendations_ids}
  end

  def previously_assigned_recommendations
    render json: get_previously_assigned_recommendations_by_classroom(params[:classroom_id], params[:activity_id])
  end

  def student_ids_for_previously_assigned_activity_pack
    render json: get_student_ids_for_previously_assigned_activity_pack_by_classroom(params[:classroom_id], params[:activity_id])
  end

  def skills_growth
    classroom = Classroom.find(params[:classroom_id])
    cache_keys = {
      pre_test: params[:pre_test_activity_id],
      post_test: params[:post_test_activity_id]
    }

    json = current_user.classroom_cache(classroom, key: 'teachers.progress_reports.diagnostic_reports.skills_growth', groups: cache_keys) do
      { skills_growth: skills_growth_by_classroom_for_post_tests(params[:classroom_id], params[:post_test_activity_id], params[:pre_test_activity_id]) }
    end

    render json: json
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit
    params.permit(:unit_id, :activity_id)
    unit_id = params[:unit_id]
    activity_id = params[:activity_id]
    classroom_units = ClassroomUnit.where(unit_id: unit_id, classroom_id: current_user.classrooms_i_teach.map(&:id))
    last_activity_session = ActivitySession.where(classroom_unit: classroom_units, activity_id: activity_id, is_final_score: true).order(updated_at: :desc).limit(1)&.first
    classroom_id = last_activity_session&.classroom_unit&.classroom_id

    # rubocop:disable Style/GuardClause
    if !classroom_id
      return render json: {}, status: 404
    elsif Activity.diagnostic_activity_ids.include?(activity_id.to_i)
      activity_is_a_post_test = Activity.find_by(follow_up_activity_id: activity_id).present?
      summary_or_growth_summary = activity_is_a_post_test ? 'growth_summary' : 'summary'
      unit_query_string = "?unit=#{unit_id}"
      render json: { url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity_id}/classroom/#{classroom_id}/#{summary_or_growth_summary}#{unit_query_string}" }
    else
      render json: { url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students" }
    end
    # rubocop:enable Style/GuardClause
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def assign_post_test
    Unit::AssignmentHelpers.assign_unit_to_one_class(params[:classroom_id], params[:unit_template_id], params[:student_ids], false)

    render json: {}
  end

  def assign_independent_practice_packs
    IndependentPracticePacksAssigner.run(
      assigning_all_recommended_packs: params[:assigning_all_recommended_packs],
      classroom_id: params[:classroom_id],
      diagnostic_activity_id: params[:diagnostic_activity_id],
      release_method: params[:release_method],
      selections: params[:selections],
      user: current_user
    )

    render json: {}
  rescue IndependentPracticePacksAssigner::TeacherNotAssociatedWithClassroomError => e
    render json: { error: e.message }, status: 401
  end

  def assign_whole_class_instruction_packs
    return render json: {}, status: 401 unless params[:classroom_id].to_i.in?(current_user.classrooms_i_teach.pluck(:id))

    set_lesson_diagnostic_recommendations_start_time
    last_recommendation_index = params[:unit_template_ids].length - 1

    params[:unit_template_ids].each_with_index do |unit_template_id, index|
      AssignRecommendationsWorker.perform_async(
        {
          'assign_on_join' => true,
          'classroom_id' => params[:classroom_id],
          'is_last_recommendation' => (index == last_recommendation_index),
          'lesson' => true,
          'student_ids' => [],
          'unit_template_id' => unit_template_id
        }
      )
    end

    render json: {}
  end

  def default_diagnostic_report
    redirect_to default_diagnostic_url
  end

  def report_from_classroom_unit_and_activity
    activity = Activity.find_by_id_or_uid(params[:activity_id])
    url = classroom_report_url(params[:classroom_unit_id].to_i, activity.id)

    if url
      redirect_to url
    else
      redirect_to teachers_progress_reports_landing_page_path
    end
  end

  def report_from_classroom_unit_and_activity_and_user
    classroom_unit = ClassroomUnit.find(params[:classroom_unit_id])
    unit_id = classroom_unit.unit_id
    classroom_id = classroom_unit.classroom_id
    act_sesh_report = activity_session_report(unit_id, classroom_id, params[:user_id].to_i, params[:activity_id].to_i)
    respond_to do |format|
      format.html { redirect_to act_sesh_report[:url] }
      format.json { render json: act_sesh_report.to_json }
    end
  end

  def report_from_classroom_and_unit_and_activity_and_user
    act_sesh_report = activity_session_report(params[:unit_id], params[:classroom_id], params[:user_id].to_i, params[:activity_id].to_i)
    respond_to do |format|
      format.html { redirect_to act_sesh_report[:url] }
      format.json { render json: act_sesh_report.to_json }
    end
  end

  def diagnostic_status
    cas = RawSqlRunner.execute(
      <<-SQL
        SELECT activity_sessions.state
        FROM classrooms_teachers
        JOIN classrooms
          ON  classrooms_teachers.classroom_id = classrooms.id
          AND classrooms.visible = true
        JOIN classroom_units
          ON  classrooms.id = classroom_units.classroom_id
          AND classroom_units.visible = true
        JOIN unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
          AND unit_activities.visible = true
          AND unit_activities.activity_id IN (#{Activity.diagnostic_activity_ids.join(', ')})
        LEFT JOIN activity_sessions
          ON  classroom_units.id = activity_sessions.classroom_unit_id
          AND unit_activities.activity_id = activity_sessions.activity_id
          AND activity_sessions.state = 'finished'
          AND activity_sessions.visible = true
        WHERE classrooms_teachers.user_id = #{current_user.id}
      SQL
    ).to_a

    if cas.include?('finished')
      diagnostic_status = 'completed'
    elsif cas.any?
      diagnostic_status = 'assigned'
    else
      diagnostic_status = 'unassigned'
    end
    render json: {diagnosticStatus: diagnostic_status}
  end

  def diagnostic_results_summary
    render json: fetch_diagnostic_results_summary_cache
  end

  def diagnostic_growth_results_summary
    pre_test = Activity.find_by(follow_up_activity_id: results_summary_params[:activity_id])
    render json: GrowthResultsSummary.growth_results_summary(pre_test.id, results_summary_params[:activity_id], results_summary_params[:classroom_id])
  end

  private def fetch_diagnostic_results_summary_cache
    groups = { activity_id: params[:activity_id] }
    current_user.classroom_unit_by_ids_cache(
      classroom_id: params[:classroom_id],
      unit_id: params[:unit_id],
      activity_id: params[:activity_id],
      key: 'teachers.progress_reports.diagnostic_reports.diagnostic_results_summary',
      groups: groups
    ) do
      ResultsSummary.results_summary(results_summary_params[:activity_id], results_summary_params[:classroom_id], results_summary_params[:unit_id])
    end
  end

  private def authorize_teacher!
    classroom_teacher!(params[:classroom_id])
  end

  private def results_summary_params
    params.permit(:classroom_id, :activity_id, :unit_id)
  end

  private def individual_student_diagnostic_responses_params
    params.permit(:student_id, :classroom_id, :activity_id, :unit_id)
  end

  private def find_activity_session_for_student_activity_and_classroom(student_id, activity_id, classroom_id, unit_id)
    if unit_id
      classroom_unit = ClassroomUnit.find_by(unit_id: unit_id, classroom_id: classroom_id)
      activity_session = ActivitySession.find_by(classroom_unit: classroom_unit, state: 'finished', user_id: student_id)
    else
      classroom_units = ClassroomUnit.where(classroom_id: classroom_id).joins(:unit, :unit_activities).where(unit: {unit_activities: {activity_id: activity_id}})
      activity_session = ActivitySession.where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: student_id).order(completed_at: :desc).first
    end
  end

  private def diagnostic_student_responses
    @assigned_students.map do |student|
      activity_session = @activity_sessions[student.id]

      if activity_session
        formatted_concept_results = format_concept_results(activity_session, activity_session.concept_results)
        score = get_average_score(formatted_concept_results)
        if score >= (ProficiencyEvaluator.proficiency_cutoff * 100)
          proficiency = ActivitySession::PROFICIENT
        elsif score >= (ProficiencyEvaluator.nearly_proficient_cutoff * 100)
          proficiency = ActivitySession::NEARLY_PROFICIENT
        else
          proficiency = ActivitySession::NOT_YET_PROFICIENT
        end
        {
          name: student.name,
          id: student.id,
          score: score,
          proficiency: proficiency
        }
      else
        { name: student.name }
      end
    end
  end

  private def skills_growth_by_classroom_for_post_tests(classroom_id, post_test_activity_id, pre_test_activity_id)
    set_post_test_activity_sessions_and_assigned_students(post_test_activity_id, classroom_id)

    @post_test_activity_sessions.reduce(0) do |sum, as|
      post_correct_skill_ids = as&.correct_skill_ids
      pre_correct_skill_ids = ActivitySession
        .includes(:concept_results, activity: {skills: :concepts})
        .where(user_id: as.user_id, activity_id: pre_test_activity_id)
        .order(completed_at: :desc)
        .first
        &.correct_skill_ids
      total_acquired_skills_count = post_correct_skill_ids && pre_correct_skill_ids ? (post_correct_skill_ids - pre_correct_skill_ids).length : 0
      sum += total_acquired_skills_count > 0 ? total_acquired_skills_count : 0
    end
  end

  private def set_banner_variables
    acknowledge_lessons_banner_milestone = Milestone.find_by_name(Milestone::TYPES[:acknowledge_lessons_banner])
    @show_lessons_banner = !UserMilestone.find_by(milestone_id: acknowledge_lessons_banner_milestone&.id, user_id: current_user&.id) && current_user&.classroom_unit_activity_states&.where(completed: true)&.none?
  end

  private def set_lesson_diagnostic_recommendations_start_time
    $redis.set("user_id:#{current_user.id}_lesson_diagnostic_recommendations_start_time", Time.current)
  end

end
