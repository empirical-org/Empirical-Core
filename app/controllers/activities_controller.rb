class ActivitiesController < ApplicationController
  before_action :activity, only: [:update, :retry]



  def update
    activity_session.start
    activity_session.save!
    redirect_to activity_session_path(activity_session)
  end

  def retry
    redirect_to new_session_path if current_user.nil?

    @activity_session = ActivitySession.new(is_retry: true,
                                            user_id: current_user.id,
                                            activity_id: @activity.id,
                                            classroom_activity_id: params[:classroom_activity_id])
    @activity_session.start
    @activity_session.save!
    redirect_to activity_session_path(@activity_session)
  end

protected

  def activity
    @activity ||= Activity.find(params[:id])
  end

  def activity_session
    @activity_session ||= if params[:anonymous]
      nil
    else
      ActivitySession.unscoped.find(params[:session])
    end
  end

end
