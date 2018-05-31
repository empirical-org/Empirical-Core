class Api::V1::ActivityFlagsController < Api::ApiController

  def index
    render json: Activity::FLAGS
  end
end
