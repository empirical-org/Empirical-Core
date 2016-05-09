class ActivitySessionsController < ApplicationController
  before_action :activity_session_from_id, only: [:play]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]

  before_action :activity_session_authorize!, only: [:play, :result]

  def play
    if @activity_session.state == "finished"
      newSession = ActivitySession.create(
       state: "unstarted",
       user_id: @activity_session.user_id,
       activity_id: @activity_session.activity_id,
       classroom_activity_id: @activity_session.classroom_activity_id,
       is_retry: true
      )
      redirect_to play_activity_session_path(newSession)
    end
    @activity_session.start
    @activity_session.save!
    @module_url = @activity.module_url(@activity_session)
  end

  def result
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
    @module_url = @activity.anonymous_module_url
    render 'play'
  end

  private

  def activity_session_from_id
    @activity_session ||= ActivitySession.where(id: params[:id]).first
    unless @activity_session
      render_error(404)
    end
  end

  def activity_session_from_uid
    @activity_session ||= ActivitySession.find_by_uid!(params[:uid])
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
    if not ActivityAuthorizer.new(current_user, @activity_session).authorize
      render_error(404)
    end
  end
end
