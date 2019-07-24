class Cms::DataController < Cms::ActivitiesController
  def show
    params[:activity_id]
    @activity = Activity.find(params[:activity_id])
  end
end
