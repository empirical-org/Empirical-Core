class ActivitySessionsController < ApplicationController
  before_action :activity_session_from_id, only: [:play, :concept_results]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:play, :result]

  before_action :activity_session_authorize!, only: [:play, :result]
  before_action :activity_session_authorize_teacher!, only: [:concept_results]

  def play
    if @activity_session.state == "finished"
      started_session = ActivitySession.where(
        user_id: @activity_session.user_id,
        activity_id: @activity_session.activity_id
        ).last
      if started_session && started_session.started_at && started_session.started_at > @activity_session.completed_at
        redirect_to play_activity_session_path(started_session)
      else
        new_session = ActivitySession.create(
         state: "unstarted",
         user_id: @activity_session.user_id,
         activity_id: @activity_session.activity_id,
         classroom_activity_id: @activity_session.classroom_activity_id,
         is_retry: true
        )
        redirect_to play_activity_session_path(new_session)
      end
    else
      @activity_session.start
      @activity_session.save!
      @module_url = @activity.module_url(@activity_session)
      redirect_to(@module_url.to_s)
    end
  end

  def result
    @activity = @activity_session
    @results  = @activity_session.parse_for_results
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
    @module_url = @activity.anonymous_module_url
    redirect_to(@module_url.to_s)
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
