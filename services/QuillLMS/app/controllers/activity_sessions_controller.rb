class ActivitySessionsController < ApplicationController
  include HTTParty
  layout :determine_layout
  before_action :activity_session_from_id, only: [:play, :concept_results]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]
  before_action :activity_session_authorize!, only: [:play, :result]
  before_action :activity_session_authorize_teacher!, only: [:concept_results]
  before_action :authorize_student_belongs_to_classroom_unit!, only: [:activity_session_from_classroom_unit_and_activity]
  after_action  :update_student_last_active, only: [:play, :result]

  def play
    @module_url = @activity.module_url(@activity_session)
    redirect_to(@module_url.to_s)
  end

  def result
    allow_iframe
    if session[:partner_session]
      @partner_name = session[:partner_session]["partner_name"]
      @partner_session_id = session[:partner_session]["session_id"]
    end
    if @partner_name && @partner_session_id
      @activity_url = @activity_session.activity.anonymous_module_url.to_s
      @results_url = url_for(action: 'result', uid: @activity_session.uid)
      AmplifyReportActivityWorker.perform_async(@partner_session_id, @activity_session.activity.name, @activity_session.activity.description, @activity_session.percentage, @activity_url, @results_url)
    end
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
    @classroom_id = @activity_session&.classroom_unit&.classroom_id
    @result_category_names = {
      PROFICIENT: ActivitySession::PROFICIENT,
      NEARLY_PROFICIENT: ActivitySession::NEARLY_PROFICIENT,
      NOT_YET_PROFICIENT: ActivitySession::NOT_YET_PROFICIENT
    }
    @title = 'Classwork'
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

  private def activity_session_from_id
    @activity_session ||= ActivitySession.where(id: params[:id]).first || ActivitySession.where(uid: params[:id]).first
    unless @activity_session
      render_error(404)
    end
  end

  private def activity_session_from_uid
    @activity_session ||= ActivitySession.unscoped.find_by(uid: params[:uid])
    unless @activity_session
      render_error(404)
    end
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
    if @activity_session.user_id.nil?
      return true
    end

    unless AuthorizedUserForActivity.new(current_user, @activity_session).call
      render_error(404)
    end
  end

  private def activity_session_authorize_teacher!
    unless AuthorizedTeacherForActivity.new(current_user, @activity_session).call
      render_error(404)
    end
  end

  private def update_student_last_active
    if current_user && current_user.role == 'student'
      UpdateStudentLastActiveWorker.perform_async(current_user.id, DateTime.now)
    end
  end

  private def authorize_student_belongs_to_classroom_unit!
    return auth_failed if current_user.nil?
    @classroom_unit = ClassroomUnit.find params[:classroom_unit_id]
    if current_user.classrooms.exclude?(@classroom_unit.classroom) then auth_failed(hard: false) end
  end

  private def determine_layout
    if session[:partner_session]
      @partner_name = session[:partner_session]["partner_name"]
      @partner_session_id = session[:partner_session]["session_id"]
      if @partner_name && @partner_session_id
        "integrations"
      end
    end
  end

  private def allow_iframe
    response.headers.delete "X-Frame-Options"
  end

end
