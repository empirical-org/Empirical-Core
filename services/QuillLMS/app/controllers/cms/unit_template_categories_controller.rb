# frozen_string_literal: true

class Cms::UnitTemplateCategoriesController < Cms::CmsController
  before_action :set_unit_template_category, only: [:edit, :update, :destroy]

  def index
    @unit_template_categories = UnitTemplateCategory.all
    respond_to do |format|
      format.html
      format.json do
        render json: @unit_template_categories
      end
    end
  end

  def edit
  end

  def create
    @unit_template_category = UnitTemplateCategory.new(unit_template_category_params)
    if @unit_template_category.save!
      render json: @unit_template_category
    else
      render json: {errors: @unit_template_category.erros}, status: 422
    end
  end

  def update
    if @unit_template_category.update(unit_template_category_params)
      render json: @unit_template_category
    else
      render json: {errors: @unit_template_category.errors}, status: 422
    end
  end

  def destroy
    @unit_template_category.destroy
    render json: {}
  end

  private def unit_template_category_params
    params.require(:unit_template_category).permit(:id, :name, :primary_color, :secondary_color)
  end

  private def set_unit_template_category
    @unit_template_category = UnitTemplateCategory.find(params[:id])
  end
end
