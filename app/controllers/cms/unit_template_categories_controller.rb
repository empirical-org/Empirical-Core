class Cms::UnitTemplateCategoriesController < ApplicationController
  before_filter :admin!

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: []#UnitTemplateCategory.all
      end
    end
  end

  def update
  end

  def destroy
  end

end