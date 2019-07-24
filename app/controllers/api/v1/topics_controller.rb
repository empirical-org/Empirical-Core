class Api::V1::TopicsController < Api::ApiController

  def index
    render json: ApiPresenter.new(Topic).simple_index
  end

end