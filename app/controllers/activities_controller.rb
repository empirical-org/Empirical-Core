class ActivitiesController < ApplicationController
  def show
    @activity_enrollment = ActivitySession.find(params[:id])
    @activity = @activity_enrollment.activity
  end
end
