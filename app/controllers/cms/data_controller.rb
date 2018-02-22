class Cms::DataController < Cms::ActivitiesController
  before_filter :staff!

  def show
    params[:id] = params[:activity_id]
    @activity = subject
  end
end
