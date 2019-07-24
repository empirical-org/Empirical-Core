class Api::V1::TopicCategoriesController < Api::ApiController

  def index
    render json: ApiPresenter.new(TopicCategory).simple_index
  end

end