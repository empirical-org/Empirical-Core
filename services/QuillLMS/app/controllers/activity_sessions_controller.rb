# frozen_string_literal: true

class ActivitySessionsController < ApplicationController
  include HTTParty
  include PublicProgressReports

  layout :determine_layout

  around_action :force_writer_db_role, only: [:activity_session_from_classroom_unit_and_activity]

  before_action :activity_session_from_id, only: [:play, :concept_results, :student_activity_report]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]
  before_action :activity_session_authorize!, only: [:play, :result, :student_activity_report]
  before_action :activity_session_authorize_teacher!, only: [:concept_results]
  before_action :authorize_student_belongs_to_classroom_unit!, only: [:activity_session_from_classroom_unit_and_activity]
  before_action :redirect_if_student_has_not_completed_pre_test, only: [:play]

  after_action  :update_student_last_active, only: [:play, :result]

  def play
    @module_url = @activity.module_url(@activity_session)
    redirect_to(@module_url.to_s)
  end

  def result
    allow_iframe

    run_partner_session_worker

    @activity = @activity_session
    @classroom_id = @activity_session&.classroom_unit&.classroom_id

    questions = @activity_session.concept_results.group_by { |cr| cr.question_number }
    key_target_skill_concepts = questions.map { |key, question| get_key_target_skill_concept_for_question(question, @activity_session) }
    correct_key_target_skill_concepts = key_target_skill_concepts.filter { |ktsc| ktsc[:correct] }

    @number_of_questions = questions.length
    @number_of_correct_questions = correct_key_target_skill_concepts.length
    @grouped_key_target_skill_concepts = format_grouped_key_target_skill_concepts(key_target_skill_concepts)

    @title = 'Classwork'
  end

  def student_activity_report
    @js_file = 'student'
    @report_data = formatted_score_obj(@activity_session, @activity_session.classification, @activity_session.user)
  end

  def anonymous
    @activity = Activity.find_by_id_or_uid(params[:activity_id])
    PreviewedActivityWorker.perform_async(current_user&.id, params[:activity_id])
    redirect_to anonymous_return_url
  end

  def activity_session_from_classroom_unit_and_activity
    started_activity_session_id = ActivitySession.find_or_create_started_activity_session(current_user.id, params[:classroom_unit_id], params[:activity_id])&.id
    redirect_to "/activity_sessions/#{started_activity_session_id}/play"
  end

  private def partner_session? = session[:partner_session].present? && partner_name && partner_session_id
  private def partner_name = session[:partner_session]["partner_name"]
  private def partner_session_id = session[:partner_session]["session_id"]

  private def run_partner_session_worker
    return unless partner_session?

    activity_url = @activity_session.activity.anonymous_module_url.to_s
    results_url = url_for(action: 'result', uid: @activity_session.uid)

    AmplifyReportActivityWorker.perform_async(
      partner_session_id,
      @activity_session.activity.name,
      @activity_session.activity.description,
      @activity_session.percentage,
      activity_url,
      results_url
    )
  end

  private def activity_session_from_id
    @activity_session ||= ActivitySession.where(id: params[:id]).first || ActivitySession.where(uid: params[:id]).first
    return if @activity_session

    render_error(404)
  end

  private def activity_session_from_uid
    @activity_session ||= ActivitySession.unscoped.find_by(uid: params[:uid])
    return if @activity_session

    render_error(404)
  end

  private def anonymous_return_url
    if @activity.classification.key == "lessons"
      "#{ENV['DEFAULT_URL']}/preview_lesson/#{@activity.uid}"
    else
      @activity.anonymous_module_url.to_s
    end
  end

  private def activity_session_for_update
    @activity_session ||= if params[:anonymous]
                            nil
      else
        ActivitySession.unscoped.find(params[:id])
    end
  end

  private def activity
    @activity ||= @activity_session.activity
  end

  private def activity_session_authorize!
    return true if @activity_session.user_id.nil?
    return if AuthorizedUserForActivity.new(current_user, @activity_session).call

    render_error(404)
  end

  private def activity_session_authorize_teacher!
    return if  AuthorizedTeacherForActivity.new(current_user, @activity_session).call

    render_error(404)
  end

  private def redirect_if_student_has_not_completed_pre_test
    pre_test = Activity.find_by(follow_up_activity_id: @activity.id, classification: ActivityClassification.diagnostic)
    return unless pre_test

    classroom_units_for_classroom = @activity_session.classroom_unit.classroom.classroom_units
    completed_pre_test_activity_session = ActivitySession.find_by(user: current_user, state: 'finished', classroom_unit: classroom_units_for_classroom)

    return if completed_pre_test_activity_session

    flash[:error] = "You need to complete the Baseline diagnostic before you can complete the Growth diagnostic."
    flash.keep(:error)
    redirect_to profile_path
  end

  private def update_student_last_active
    return unless current_user&.role&.student?

    UpdateStudentLastActiveWorker.perform_async(current_user.id, DateTime.current)
  end

  private def authorize_student_belongs_to_classroom_unit!
    return auth_failed if current_user.nil?

    @classroom_unit = ClassroomUnit.find params[:classroom_unit_id]
    if current_user.classrooms.exclude?(@classroom_unit.classroom) then auth_failed(hard: false) end
  end

  def determine_layout
    "integrations" if partner_session?
  end

  private def allow_iframe
    response.headers.delete "X-Frame-Options"
  end

end
