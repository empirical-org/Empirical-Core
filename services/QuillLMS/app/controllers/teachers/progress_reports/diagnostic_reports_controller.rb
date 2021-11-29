# frozen_string_literal: true

class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController
  include PublicProgressReports
  include LessonsRecommendations
  include DiagnosticReports
  require 'pusher'

  before_action :authorize_teacher!, only: [:question_view, :students_by_classroom, :recommendations_for_classroom, :lesson_recommendations_for_classroom, :previously_assigned_recommendations]

  def show
    @classroom_id = current_user.classrooms_i_teach&.last&.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
      set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(current_user, params[:activity_id], params[:classroom_id], params[:unit_id])
      activity = Activity.includes(:classification)
                         .find(params[:activity_id])
      render json: { data: results_by_question(params[:activity_id]),
                     classification: activity.classification.key }.to_json
  end

  def students_by_classroom
      render json: results_for_classroom(params[:unit_id], params[:activity_id], params[:classroom_id])
  end

  def diagnostic_student_responses_index
    activity_id = results_summary_params[:activity_id]
    classroom_id = results_summary_params[:classroom_id]
    unit_id = results_summary_params[:unit_id]
    set_activity_sessions_and_assigned_students_for_activity_classroom_and_unit(current_user, activity_id, classroom_id, unit_id, true)

    render json: { students: diagnostic_student_responses }
  end

  def individual_student_diagnostic_responses
    activity_id = individual_student_diagnostic_responses_params[:activity_id]
    classroom_id = individual_student_diagnostic_responses_params[:classroom_id]
    unit_id = individual_student_diagnostic_responses_params[:unit_id]
    student_id = individual_student_diagnostic_responses_params[:student_id]
    activity_session = find_activity_session_for_student_activity_and_classroom(student_id, activity_id, classroom_id, unit_id)
    student = User.find_by_id(student_id)
    skills = Activity.find(activity_id).skills.distinct
    pre_test = Activity.find_by_follow_up_activity_id(activity_id)

    if pre_test
      pre_test_activity_session = find_activity_session_for_student_activity_and_classroom(student_id, pre_test.id, classroom_id, unit_id)
      concept_results = {
        pre: { questions: format_concept_results(pre_test_activity_session.concept_results.order("(metadata->>'questionNumber')::int")) },
        post: { questions: format_concept_results(activity_session.concept_results.order("(metadata->>'questionNumber')::int")) }
      }
      formatted_skills = skills.map do |skill|
        {
          pre: data_for_skill_by_activity_session(pre_test_activity_session.id, skill),
          post: data_for_skill_by_activity_session(activity_session.id, skill)
        }
      end
      skill_results = { skills: formatted_skills.uniq { |formatted_skill| formatted_skill[:pre][:skill] } }
    else
      concept_results = { questions: format_concept_results(activity_session.concept_results.order("(metadata->>'questionNumber')::int")) }
      skill_results = { skills: skills.map { |skill| data_for_skill_by_activity_session(activity_session.id, skill) }.uniq { |formatted_skill| formatted_skill[:skill] } }
    end
    render json: { concept_results: concept_results, skill_results: skill_results, name: student.name }
  end

  def classrooms_with_students
    classrooms = classrooms_with_students_for_report(params[:unit_id], params[:activity_id])
    render json: classrooms.to_json
  end

  def recommendations_for_classroom
      render json: generate_recommendations_for_classroom(current_user, params[:unit_id], params[:classroom_id], params[:activity_id])
  end

  def lesson_recommendations_for_classroom
    render json: {lessonsRecommendations: get_recommended_lessons(current_user, params[:unit_id], params[:classroom_id], params[:activity_id])}
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

  def redirect_to_report_for_most_recent_activity_session_associated_with_activity_and_unit
    params.permit(:unit_id, :activity_id)
    unit_id = params[:unit_id]
    activity_id = params[:activity_id]
    classroom_units = ClassroomUnit.where(unit_id: unit_id, classroom_id: current_user.classrooms_i_teach.map(&:id))
    last_activity_session = ActivitySession.where(classroom_unit: classroom_units, activity_id: activity_id, is_final_score: true).order(updated_at: :desc).limit(1)&.first
    classroom_id = last_activity_session&.classroom_unit&.classroom_id
    if !classroom_id
      return render json: {}, status: 404
    elsif Activity.diagnostic_activity_ids.include?(activity_id.to_i)
      activity = Activity.find(activity_id)
      activity_is_a_post_test = Activity.find_by(follow_up_activity_id: activity_id).present?
      activity_is_a_pre_test = activity.follow_up_activity_id.present?
      results_or_growth_results = activity_is_a_post_test ? 'growth_results' : 'results'
      unit_query_string = activity_is_a_pre_test || activity_is_a_post_test ? '' : "?unit=#{unit_id}"
      render json: { url: "/teachers/progress_reports/diagnostic_reports#/diagnostics/#{activity_id}/classroom/#{classroom_id}/#{results_or_growth_results}#{unit_query_string}" }
    else
      render json: { url: "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity_id}/c/#{classroom_id}/students" }
    end
  end

  def assign_selected_packs
      if params[:selections]
        params[:selections].map { |s| s['id']}.each do |ut_id|
          ut = UnitTemplate.find(ut_id)
          Unit.unscoped.find_or_create_by(unit_template_id: ut.id, name: ut.name, user_id: current_user.id)
        end
      end
      create_or_update_selected_packs
      render json: { data: 'Hi' }
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

  def report_from_classroom_unit_activity_and_user
      act_sesh_report = activity_session_report(params[:classroom_unit_id].to_i, params[:user_id].to_i, params[:activity_id].to_i)
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
    render json: ResultsSummary.results_summary(current_user, results_summary_params[:activity_id], results_summary_params[:classroom_id], results_summary_params[:unit_id])
  end

  def diagnostic_growth_results_summary
    pre_test = Activity.find_by(follow_up_activity_id: results_summary_params[:activity_id])
    render json: GrowthResultsSummary.growth_results_summary(current_user, pre_test.id, results_summary_params[:activity_id], results_summary_params[:classroom_id])
  end

  private def create_or_update_selected_packs
    if params[:whole_class]
      $redis.set("user_id:#{current_user.id}_lesson_diagnostic_recommendations_start_time", Time.now)
      return render json: {}, status: 401 unless current_user.classrooms_i_teach.map(&:id).include?(params[:classroom_id].to_i)
      params[:unit_template_ids].each_with_index do |unit_template_id, index|
        last = (params[:unit_template_ids].length - 1 == index)
        UnitTemplate.assign_to_whole_class(params[:classroom_id], unit_template_id, last)
      end
    else
      selections_with_students = params[:selections].select do |ut|
        ut[:classrooms][0][:student_ids]&.compact&.any?
      end
      if selections_with_students.any?
        $redis.set("user_id:#{current_user.id}_diagnostic_recommendations_start_time", Time.now)
        number_of_selections = selections_with_students.length
        selections_with_students.each_with_index do |value, index|
            last = (number_of_selections - 1) == index
            # this only accommodates one classroom at a time
            classroom = value[:classrooms][0]
            argument_hash = {
              unit_template_id: value[:id],
              classroom_id: classroom[:id],
              student_ids: classroom[:student_ids].compact,
              last: last,
              lesson: false,
              assigning_all_recommended_packs: params[:assigning_all_recommended_packs]
            }
            AssignRecommendationsWorker.perform_async(**argument_hash) if current_user.classrooms_i_teach.map(&:id).include?(classroom[:id].to_i)
        end
      end
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
      unit_ids = current_user.units.joins("JOIN unit_activities ON unit_activities.activity_id = #{activity_id}")
      classroom_units = ClassroomUnit.where(unit_id: unit_ids, classroom_id: classroom_id)
      activity_session = ActivitySession.where(activity_id: activity_id, classroom_unit_id: classroom_units.ids, state: 'finished', user_id: student_id).order(completed_at: :desc).first
    end
  end

  private def diagnostic_student_responses
    @assigned_students.map do |student|
      activity_session = @activity_sessions[student.id]

      if activity_session
        formatted_concept_results = format_concept_results(activity_session.concept_results)
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

end
