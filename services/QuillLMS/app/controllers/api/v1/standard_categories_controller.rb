class Api::V1::StandardCategoriesController < Api::ApiController

  def index
    render json: ApiPresenter.new(StandardCategory).simple_index
  end

end
