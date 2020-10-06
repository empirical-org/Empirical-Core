class Api::V1::StandardsController < Api::ApiController

  def index
    render json: ApiPresenter.new(Standard).simple_index
  end

end
