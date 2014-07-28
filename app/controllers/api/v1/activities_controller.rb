class Api::V1::ActivitiesController < ApiController
  before_action :find_activity, except: [:index]

  def index
    @activities = Activity.all
  end

  private

  def find_activity
    @activity = Activity.find(params[:id])
  end

end
