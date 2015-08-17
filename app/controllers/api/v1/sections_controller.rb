class Api::V1::SectionsController < Api::ApiController

  def index
    render json: Section.api_data
  end

end