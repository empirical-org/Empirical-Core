class ActivitiesController < ApplicationController
  def show
    @activity = Activity.find(params[:id])

    @activity_session = if params[:anonymous]
      :anonymous
    else
      ActivitySession.find(params[:id])
    end
  end
end
