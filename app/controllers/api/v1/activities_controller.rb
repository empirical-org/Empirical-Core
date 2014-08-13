class Api::V1::ActivitiesController < ApiController

  before_action :find_activity, except: [:index]

  def index
    # FIXME: original API doesn't support index
    @activities = Activity.all
  end

  # GET
  def show
    # methods = endpoint.attributes.keys
    # render json: { object: @object.as_json(root: false, only: [], methods: (methods << 'uid')) }
  end

  # PATCH, PUT
  def update

  end

  # POST
  def create

  end

  private

  def find_activity
    @activity = Activity.find_by_uid(params[:id])
  end

  def activity_params
    params.require(:id)
  end

end
