class CMS::DataController < CMS::ActivitiesController
  def show
    params[:id] = params[:activity_id]
    @activity = subject
  end
end