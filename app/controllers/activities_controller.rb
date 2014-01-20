class ActivitiesController < ApplicationController
  def show
    @activity_enrollment = ActivityEnrollment.find(params[:id])
    @activity = @activity_enrollment.activity
  end
end
