class Cms::StandardCategoriesController < Cms::CmsController
  def index
    change_logs = []
    standard_categories = StandardCategory.includes(:activities, change_logs: :user).all.map do |sc|
      standard_category = sc.attributes
      standard_category[:activity_count] = sc.activities.count
      standard_category[:change_logs] = sc.change_logs.map do |cl|
        change_log = cl.attributes
        change_log[:user] = cl.user
        change_log[:record_name] = sc.name
        change_logs.push(change_log)
        change_log
      end
      standard_category
    end

    render json: { standard_categories: standard_categories, change_logs: change_logs }
  end

  def create
    standard_category = standard_category_params

    if standard_category[:change_logs_attributes]
      standard_category[:change_logs_attributes] = standard_category[:change_logs_attributes].map do |cl|
        cl[:user_id] = current_user.id
        cl
      end
    end

    new_standard_category = StandardCategory.create!(standard_category)

    render json: { standard_category: new_standard_category }
  end

  def update
    standard_category = standard_category_params
    standard_category[:change_logs_attributes] = standard_category[:change_logs_attributes].map do |cl|
      cl[:user_id] = current_user.id
      cl
    end

    updated_standard_category = StandardCategory.find_by_id(params[:id]).update(standard_category)

    render json: { standard_category: updated_standard_category }
  end

  def standard_category_params
    params.require(:standard_category).permit(
      :name,
      :id,
      :visible,
      change_logs_attributes: [
        :action,
        :explanation,
        :changed_attribute,
        :previous_value,
        :new_value,
        :changed_record_id,
        :changed_record_type,
        :user_id
      ]
    )
  end
end
