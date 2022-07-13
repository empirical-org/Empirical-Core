# frozen_string_literal: true

class Api::V1::StandardCategoriesController < Api::ApiController

  def index
    render json: { standard_categories: ApiPresenter.new(StandardCategory).simple_index }
  end
end
