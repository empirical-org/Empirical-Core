class ActivitiesController < ApplicationController
  before_action :authorize!, only: [:show]
  before_action :get_activity, only: [:start, :retry, :resume, :show]

  # def start
  #   activity_session.trash! unless activity_session.unstarted?
  #   redirect_to activity_path(activity, session: activity_session.id)
  # end

  def retry

    # flag these as retries so we can filter them out inexpensively ! 

    if current_user.nil?
      redirect_to new_session_path
    else
      # need to include related classroom_activity
      # @activity_session = ActivitySession.create(is_retry: true, user_id: current_user.id, activity_id: @activity.id, classroom_activity_id: params[:classroom_activity_id])
      @activity_session = ActivitySession.create(user_id: current_user.id, activity_id: @activity.id, classroom_activity_id: params[:classroom_activity_id])
      redirect_to activity_path(@activity, session: @activity_session.id)
    end
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
      ActivitySession.unscoped.find(params[:session])
    end
  end

  def authorize!
    return true if activity_session == :anonymous
    return true if current_user.try(:admin?)

    if activity_session.blank? || activity_session.user != current_user
      render(text: '', status: 401)
    end

    true
  end
end
