class ActivitySessionsController < ApplicationController
  before_action :activity_session_from_id, only: [:show]
  before_action :activity_session_from_uid, only: [:result]
  before_action :activity, only: [:show, :result]

  before_action :activity_session_authorize!, only: [:show, :result]

  def show
  end

  def result
  end

  def anonymous
    @activity = Activity.find(params[:activity_id])
  end


  private


  def activity_session_from_id
    @activity_session ||= ActivitySession.find(params[:id])
  end

  def activity_session_from_uid
    @activity_session ||= ActivitySession.find_by_uid!(params[:uid])
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
