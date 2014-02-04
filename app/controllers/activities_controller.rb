class ActivitiesController < ApplicationController
  def show
    @activity_session = ActivitySession.find(params[:id])
    @activity = @activity_session.activity
  end
end
