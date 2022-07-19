# frozen_string_literal: true

class Api::V1::StandardsController < Api::ApiController

  def index
    render json: { standards: ApiPresenter.new(Standard).simple_index }
  end

end
