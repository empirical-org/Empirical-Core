# frozen_string_literal: true

class Cms::UnitTemplatesController < Cms::CmsController
  skip_before_action :verify_authenticity_token
  before_action :set_unit_template, only: [:edit, :update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        unit_templates =
          UnitTemplate
            .includes(activities: [:raw_score, { standard: :standard_category }])
            .includes(:unit_template_category)
            .order(order_number: :asc)

        render json: unit_templates, each_serializer: Cms::UnitTemplateSerializer
      end
    end
  end

  def edit
    @unit_template = Cms::UnitTemplateSerializer.new(@unit_template).as_json(root: false)
  end

  def new
    @unit_template = UnitTemplate.new
  end

  def create
    @unit_template = UnitTemplate.new(unit_template_params.except(:activity_ids))
    if @unit_template.save!
      unit_template_params[:activity_ids].each_with_index do |activity_id, order_number|
        ActivitiesUnitTemplate.create(activity_id:, order_number:, unit_template_id: @unit_template.id)
      end

      render json: @unit_template
    else
      render json: { errors: @unit_template.errors }, status: 422
    end
  end

  def update
    if @unit_template.update(unit_template_params.except(:activity_ids))
      @unit_template.activities_unit_templates.destroy_all

      unit_template_params[:activity_ids].each_with_index do |activity_id, order_number|
        ActivitiesUnitTemplate.create(activity_id:, order_number:, unit_template_id: @unit_template.id)
      end

      render json: @unit_template
    else
      render json: { errors: @unit_template.errors }, status: 422
    end
  end

  def update_order_numbers
    unit_templates = params[:unit_templates]
    unit_templates.each { |ut| UnitTemplate.find(ut['id']).update(order_number: ut['order_number']) }
    UnitTemplate.delete_all_caches
    render json: { unit_templates: UnitTemplate.order(order_number: :asc) }
  end

  def destroy
    @unit_template.destroy
    render json: {}
  end

  private def set_unit_template
    @unit_template = UnitTemplate.find(params[:id])
  end

  private def unit_template_params
    params
      .require(:unit_template)
      .permit(
        :id,
        :authenticity_token,
        :name,
        :flag,
        :author_id,
        :activity_info,
        :time,
        :order_number,
        :unit_template_category_id,
        :image_link,
        grades: [],
        activity_ids: []
      )
  end
end
