class Cms::UnitTemplatesController < ApplicationController
  before_filter :staff!
  before_action :set_unit_template, only: [:update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.all.map{|u| Cms::UnitTemplateSerializer.new(u).as_json(root: false)}
      end
    end
  end

  def create
    attributes = unit_template_params

    attributes.delete(:authenticity_token)

    @unit_template = UnitTemplate.new(unit_template_params)
    if @unit_template.save!
      render json: @unit_template
    else
      render json: {errors: @unit_template.errors}, status: 422
    end
  end

  def update
    if @unit_template.update_attributes(unit_template_params)
      render json: @unit_template
    else
      render json: {errors: @unit_template.errors}, status: 422
    end
  end

  def destroy
    @unit_template.destroy
    render json: {}
  end

  private

  def set_unit_template
    @unit_template = UnitTemplate.find(params[:id])
  end

  def unit_template_params
    params.require(:unit_template)
            .permit(:id,
                    :authenticity_token,
                    :name,
                    :author_id,
                    :problem,
                    :summary,
                    :teacher_review,
                    :time,
                    :unit_template_category_id,
                    grades: [],
                    activity_ids: [])
  end
end
