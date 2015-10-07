class UnitTemplatesController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.all
      end
    end
  end
end
