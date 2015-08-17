class Api::V1::TopicCategoriesController < Api::ApiController

  def index
    render json: TopicCategory.api_data
  end

end