class CMS::DataController < CMS::ActivitiesController
  layout 'scorebook'

  def show
    params[:id] = params[:activity_id]
    @activity = subject
  end
end