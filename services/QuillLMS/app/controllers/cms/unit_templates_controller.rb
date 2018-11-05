class Cms::UnitTemplatesController < Cms::CmsController
  before_action :set_unit_template, only: [:update, :destroy]
  GREEN_IMAGE_CLASSES = ['','icon-flag-green','icon-puzzle-green','','icon-diagnostic-green',
                         'icon-connect-green','icon-lessons-green']
  ACT_CLASSIFICATION_ALIAS = ['','Quill Proofreader','Quill Grammar','','Quill Diagnostic',
                              'Quill Connect','Quill Lessons']
  SCOREBOOK_ICON_CLASSES = [
    '', 'icon-flag', 'icon-puzzle', '','icon-diagnostic','icon-connect','icon-lessons'
  ]

  def index
    respond_to do |format|
      format.html
      format.json do
        # UnitTemplate.order(order_number: :asc) # very fast
        #render json: UnitTemplate.order(order_number: :asc).map{|u| Cms::UnitTemplateSerializer.new(u).as_json(root: false)}
        #NOTE: See this thread to properly interpret the included array client side https://discuss.jsonapi.org/t/why-is-included-an-array/76

        result = {"data":[], "included":[]}
        # get main data (unit templates) ~20ms
        result[:data] = ActiveRecord::Base.connection.execute("
         SELECT DISTINCT id,name,unit_template_category_id,time,grades,author_id,flag,order_number,activity_info,created_at,updated_at, array_to_string(array_agg(activity_id),',') as activity_ids
          FROM unit_templates JOIN activities_unit_templates ON unit_templates.id = unit_template_id
          GROUP BY id
          ORDER BY order_number ASC;"
        ).map {|ut| 
          {
            "id":ut["id"],
            "type":"unit_templates",
            "attributes": { 
              "name":ut["name"],
              "unit_template_category":ut["unit_template_category"],
              "time":ut["time"],
              "grades":(ut["grades"].split("\n- ") unless ut["graded"].nil?),
              "author_id":ut["author_id"],
              "flag":ut["flag"],
              "order_number":ut["order_number"],
              "activity_info": ut["activity_info"]
            },
            "relationships":{
              "activities":{
                "data":ut["activity_ids"].split(",").map {|ai| {'id':ai, 'type':'activities'}}
              }
            }
          }
        }
        # get included activities ~20ms
        result[:included] += ActiveRecord::Base.connection.execute("
          SELECT DISTINCT * FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates);
        ").map { |act|
          {
            "type":"activities",
            "id":act["id"],
            "attributes":{
              "uid":act["uid"],
              "name":act["name"],
              "description":act["description"],
              "data":act["data"],
              "flags":act["flags"].sub("{","").sub("}","").split(","),
              "supporting_info":act["supporting_info"],
              "created_at":act["created_at"],
              "updated_at":act["updated_at"],
              "anonymous_path": Rails.application.routes.url_helpers.anonymous_activity_sessions_path(activity_id: act["id"])
            },
            "relationships": {
              "topic":{"data":{"type":"topics", "id":act["topic_id"]}},
              "activity_classification":{"data":{"type":"activity_classifications", "id":act["activity_classification_id"]}}
            }
          }
        }
        # get activity classifications ~7ms
        result[:included] += ActiveRecord::Base.connection.execute("
         SELECT * FROM activity_classifications WHERE activity_classifications.id IN (
          SELECT DISTINCT activity_classification_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
         );
        ").map { |ac|
          {
            "type":"activity_classifications",
            "id":ac["id"],
            "attributes": {
              "uid":ac["uid"],
              "key":ac["key"],
              "form_url":ac["form_url"],
              "module_url":ac["module_url"],
              "created_at":ac["created_at"],
              "updated_at":ac["updated_at"],
              "app_name":ac["app_name"],
              "order_number":ac["order_number"],
              "instructor_mode":ac["instructor_mode"],
              "locked_by_default":ac["locked_by_default"],
              "green_image_class":GREEN_IMAGE_CLASSES[ac["id"].to_i],
              "alias":ACT_CLASSIFICATION_ALIAS[ac["id"].to_i],
              "scorebook_icon_class":SCOREBOOK_ICON_CLASSES[ac["id"].to_i]
            }
          }
        }
        #
        # get topics ~9ms
        result[:included] += ActiveRecord::Base.connection.execute("
          SELECT * FROM topics WHERE topics.id IN (
           SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
          );
        ").map { |t|
          { 
            "id":t["id"],
            "type":"topics",
            "attributes": {
              "uid":t["uid"],
              "name":t["name"],
              "created_at":t["created_at"],
              "updated_at":t["updated_at"]
            },
            "relationships":{
              "section": {
                "data":{"type":"sections","id":t["section_id"]}
              },
              "topic_category":{
                "data":{"type":"topic_categories","id":t["topic_category_id"]}
              }
            }
          }
        }
        # get sections ~9ms
        result[:included] += ActiveRecord::Base.connection.execute("
          SELECT * FROM sections WHERE sections.id IN (
           SELECT DISTINCT section_id FROM topics WHERE topics.id IN (
            SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
           )
          );
        ").map { |s|
          {
            "id":s["id"],
            "type":"sections",
            "attributes": {
              "uid":s["uid"],
              "name":s["name"],
              "position":s["position"],
              "created_at":s["created_at"],
              "updated_at":s["updated_at"]
            }
          }
        }
        #
        # get topic_categories ~7ms
        result[:included] += ActiveRecord::Base.connection.execute("
          SELECT * FROM topic_categories WHERE topic_categories.id IN (
            SELECT DISTINCT topic_category_id FROM topics WHERE topics.id IN (
             SELECT DISTINCT topic_id FROM activities_unit_templates JOIN activities on activity_id = activities.id where unit_template_id in (SELECT id FROM unit_templates)
           )
          );
        ").map { |tc|
          {
            "id":tc["id"],
            "type":"topic_categories",
            "attributes":{
              "uid":tc["uid"],
              "name":tc["name"],
              "created_at":tc["created_at"],
              "updated_at":tc["updated_at"]
            }
          }
        }
        render json: result 
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
