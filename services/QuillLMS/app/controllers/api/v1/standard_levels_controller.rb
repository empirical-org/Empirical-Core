class Api::V1::StandardLevelsController < Api::ApiController

  def index
    render json: ApiPresenter.new(StandardLevel).simple_index
  end
end
