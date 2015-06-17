class ActivitySessionsController < ApplicationController
  layout 'scorebook'
  
  def show
    @activity_session = ActivitySession.find_by_uid!(params[:id])
    @activity = @activity_session.activity
  end
end
