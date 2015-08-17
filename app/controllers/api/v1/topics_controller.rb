class Api::V1::TopicsController < Api::ApiController

  def index
    render json: Topic.api_data
  end

end