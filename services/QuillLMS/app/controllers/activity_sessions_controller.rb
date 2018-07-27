class ActivitySessionsController < ApplicationController
  include HTTParty
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
    path_request_to_firebase if @activity.activity_classification_id == 6
    redirect_to(@module_url.to_s)
  end

  def result
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
    @classroom_id = @activity_session&.classroom_unit&.classroom_id
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
    redirect_to anonymous_return_url
  end

  def activity_session_from_classroom_unit_and_activity
    started_activity_session_id = ActivitySession.find_or_create_started_activity_session(current_user.id, params[:classroom_unit_id], params[:activity_id])&.id
    redirect_to "/activity_sessions/#{started_activity_session_id}/play"
  end

  private

  def activity_session_from_id
    @activity_session ||= ActivitySession.where(id: params[:id]).first || ActivitySession.where(uid: params[:id]).first
    unless @activity_session
      render_error(404)
    end
  end

  def activity_session_from_uid
    @activity_session ||= ActivitySession.unscoped.find_by_uid!(params[:uid])
  end

  def path_request_to_firebase
    classroom_unit_id = @activity_session.classroom_unit_id
    HTTParty.patch(
        firebase_url_for(
            classroom_unit_id
        ),
        body: firebase_json_request_body.to_json
    )
  end

  def firebase_json_request_body
    @options ||= {"#{@activity_session.uid}": current_user.name}
  end

  def firebase_url_for(classroom_unit_id)
    @url ||= "#{ENV['FIREBASE_DATABASE_URL']}/v2/classroom_lesson_sessions/#{classroom_unit_id}/students.json"
  end

  def anonymous_return_url
    if @activity.classification.key == "lessons"
      "#{ENV['DEFAULT_URL']}/preview_lesson/#{@activity.uid}"
    else
      @activity.anonymous_module_url.to_s
    end
  end

  def activity_session_for_update
    @activity_session ||= if params[:anonymous]
      nil
    else
      ActivitySession.unscoped.find(params[:id])
    end
  end

  def activity
    @activity ||= @activity_session.activity
  end

  def activity_session_authorize!
    if @activity_session.user_id.nil?
      return true
    end

    unless AuthorizedUserForActivity.new(current_user, @activity_session).call
      render_error(404)
    end
  end

  def activity_session_authorize_teacher!
    unless AuthorizedTeacherForActivity.new(current_user, @activity_session).call
      render_error(404)
    end
  end

  def update_student_last_active
    if current_user && current_user.role == 'student'
      UpdateStudentLastActiveWorker.perform_async(current_user.id, DateTime.now)
    end
  end

  def authorize_student_belongs_to_classroom_unit!
    @classroom_unit = ClassroomUnit.find params[:classroom_unit_id]
    if current_user.classrooms.exclude?(@classroom_unit.classroom) then auth_failed end
  end

end
