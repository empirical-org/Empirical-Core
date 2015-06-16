class CMS::DataController < CMS::ActivitiesController
  layout 'old'

  def show
    params[:id] = params[:activity_id]
    @activity = subject
  end
end