class ActivitiesController < ApplicationController
  before_action :authorize!, only: [:show]
  before_action :get_activity, only: [:start, :retry, :resume, :show]

  # def start
  #   activity_session.trash! unless activity_session.unstarted?
  #   redirect_to activity_path(activity, session: activity_session.id)
  # end

  def retry
    @activity_session = ClassroomActivity.create_session(@activity, user: current_user)
    redirect_to activity_path(@activity, session: @activity_session.id)
  end

  # def resume
  #   redirect_to activity_path(activity, session: activity_session.id)
  # end

protected

  def get_activity
    @activity = Activity.find(params[:id])
  end

  def activity_session
    @activity_session ||= if params[:anonymous]
      :anonymous
    else
      ActivitySession.find(params[:session])
    end
  end

  def authorize!
    return true if activity_session == :anonymous

    if activity_session.blank? || activity_session.user != current_user
      render(text: '', status: 401)
    end

    true
  end
end
