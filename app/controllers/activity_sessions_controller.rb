class ActivitySessionsController < ApplicationController
  include HTTParty
  before_action :activity_session_from_id, only: [:play, :concept_results]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]

  before_action :activity_session_authorize!, only: [:play, :result]
  before_action :activity_session_authorize_teacher!, only: [:concept_results]
  after_action  :update_student_last_active, only: [:play, :result]

  def play
    @module_url = @activity.module_url(@activity_session)
    if @activity.activity_classification_id == 6
      classroom_activity_id = @activity_session.classroom_activity_id
      url = "#{ENV['FIREBASE_DATABASE_URL']}/v2/classroom_lesson_sessions/#{classroom_activity_id}/students.json"
      options = {"#{@activity_session.uid}": current_user.name}
      HTTParty.patch(url, body: options.to_json)
    end
    redirect_to(@module_url.to_s)
  end

  def result
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
    @classroom_id = @activity_session&.classroom_activity&.classroom_id
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
    return redirect_to "#{ENV['DEFAULT_URL']}/preview_lesson/#{@activity.uid}" if @activity.classification.key == 'lessons'
    redirect_to(@activity.anonymous_module_url.to_s)
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
    elsif !ActivityAuthorizer.new(current_user, @activity_session).authorize
      render_error(404)
    end
  end

  def activity_session_authorize_teacher!
    if !ActivityAuthorizer.new(current_user, @activity_session).authorize_teacher
      render_error(404)
    end
  end

  def update_student_last_active
    if current_user && current_user.role == 'student'
      UpdateStudentLastActiveWorker.perform_async(current_user.id, DateTime.now)
    end
  end
end
