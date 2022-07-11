# frozen_string_literal: true

class Api::V1::StandardLevelsController < Api::ApiController

  def index
    render json: { standard_levels: ApiPresenter.new(StandardLevel).simple_index }
  end
end
