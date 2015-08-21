class Api::V1::SectionsController < Api::ApiController

  def index
    render json: ApiPresenter.new(Section).simple_index
  end
end
