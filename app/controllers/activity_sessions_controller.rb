class ActivitySessionsController < ApplicationController
  before_action :activity_session_from_id, only: [:play, :concept_results]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]

  before_action :activity_session_authorize!, only: [:play, :result]
  before_action :activity_session_authorize_teacher!, only: [:concept_results]

  def play
    # old_play_function
    @module_url = @activity.module_url(@activity_session)
    redirect_to(@module_url.to_s)
  end

  def result
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
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
end
