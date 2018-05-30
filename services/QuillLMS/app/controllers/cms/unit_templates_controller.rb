class Cms::UnitTemplatesController < Cms::CmsController
  before_action :set_unit_template, only: [:update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        render json: UnitTemplate.order(order_number: :asc).map{|u| Cms::UnitTemplateSerializer.new(u).as_json(root: false)}
      end
    end
  end

  def create
    @unit_template = UnitTemplate.new(unit_template_params)
    if @unit_template.save!
      render json: @unit_template
    else
      render json: {errors: @unit_template.errors}, status: 422
    end
  end

  def update
    params = unit_template_params
    params['flag'] = nil if params['flag'] == 'production'
    if @unit_template.update_attributes(params)
      render json: @unit_template
    else
      render json: {errors: @unit_template.errors}, status: 422
    end
  end

  def update_order_numbers
    unit_templates = params[:unit_templates]
    unit_templates.each { |ut| UnitTemplate.find(ut['id']).update(order_number: ut['order_number']) }
    render json: {unit_templates: UnitTemplate.order(order_number: :asc)}
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
                    :flag,
                    :author_id,
                    :activity_info,
                    :time,
                    :order_number,
                    :unit_template_category_id,
                    grades: [],
                    activity_ids: [])
  end
end
