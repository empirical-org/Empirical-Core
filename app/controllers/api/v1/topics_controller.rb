class Api::V1::TopicsController < Api::ApiController

  def index
    render json: Topic.all
  end

end