class Cms::DataController < Cms::ActivitiesController
  def show
    params[:id] = params[:activity_id]
    @activity = subjacect
  end
end
