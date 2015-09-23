class Cms::UnitTemplatesController < ApplicationController

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.all
      end
    end
  end

  def show
  end

  def new
  end

  def update
  end

  def destroy
  end
end
