class Cms::UnitTemplatesController < Cms::CmsController
  before_action :set_unit_template, only: [:update, :destroy]

  def index
    respond_to do |format|
      format.html
      format.json do
        # UnitTemplate.order(order_number: :asc) # very fast
        render json: UnitTemplate.order(order_number: :asc).map{|u| Cms::UnitTemplateSerializer.new(u).as_json(root: false)}
        # get main data (unit templates) ~20ms
        # SELECT * FROM unit_templates  ORDER BY order_number ASC;
        # 
        # get included activities ~20ms
        # SELECT * FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates);
        #
        # get activity classifications ~7ms
        # SELECT * FROM activity_classifications WHERE activity_classifications.id IN (
        #  SELECT DISTINCT activity_classification_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
        # );
        #
        # get topics ~9ms
        # SELECT * FROM topics WHERE topics.id IN (
        #  SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
        # );
        #
        # get sections ~9ms
        # SELECT * FROM sections WHERE sections.id IN (
        #  SELECT DISTINCT section_id FROM topics WHERE topics.id IN (
        #   SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
        #  )
        # );
        #
        # get topic_categories ~7ms
        # SELECT * FROM topic_categories WHERE topic_categories.id IN (
        #   SELECT DISTINCT topic_category_id FROM topics WHERE topics.id IN (
        #    SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
        #  )
        # );
        #
        #{
        # data: [
        #  {
        #    id
        #    type
        #    attributes:{ name, unit_template_category, time, grades, author_id, flag, order_number, activity_info}
        #    relationships: {
        #      activities: {
        #        data: [
        #          {type, id}, ...
        #        ]
        #      }
        #    }
        #  },
        #  ...
        # ]
        # included: [
        #   {
        #     id
        #     type: activities
        #     attributes { uid, name, description, data, flags, supporting_info, created_at, updated_at, anonymous_path* }
        #     relationships: {
        #       activity_classification: {
        #         data: { type, id}
        #       }
        #       topic: {
        #         data: { type, id}
        #       }
        #     }
        #   },
        #   {
        #     id
        #     type: activity_classifications
        #     attributes: { uid, key, form_url, module_url, created_at, updated_at, green_image_class, alias, scorebook_icon_class, app_name, order_number, instructor_mode, locked_by_default }
        #   },
        #   {
        #     id
        #     type: topics
        #     attributes: { uid, name, created_at, updated_at }
        #     relationships: {
        #       section: {
        #         data: { type, id}
        #       }
        #       topic_category: {
        #         data: { type, id}
        #       }
        #     }
        #   },
        #   {
        #     id
        #     type: sections
        #     attributes: { uid, name, position, created_at, updated_at }
        #   },
        #   {
        #     id
        #     type: topic_categories
        #     attributes: { uid, name, created_at, updated_at }
        #   }
        # ]
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
    @unit_template.activities = []
    @unit_template.save
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
