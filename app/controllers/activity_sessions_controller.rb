class ActivitySessionsController < ApplicationController
  before_action :activity_session_from_id, only: [:start]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity_session_for_update, only: [:update]
  before_action :activity, only: [:start, :result]

  before_action :activity_session_authorize!, only: [:start, :result]

  def start
    @module_url = @activity.module_url(@activity_session)
  end

  def result
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
    @module_url = @activity.anonymous_module_url
    render 'start'
  end

  def update
    @activity_session.start
    @activity_session.save!
    redirect_to start_activity_session_path(@activity_session)
  end

  private


  def activity_session_from_id
    @activity_session ||= ActivitySession.find(params[:id])
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
      render(status: 401)
    end
  end
end
