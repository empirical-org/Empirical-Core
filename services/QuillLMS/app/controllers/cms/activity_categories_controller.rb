class Cms::ActivityCategoriesController < Cms::CmsController
  def index
    render json: { activity_categories: format_activity_categories }
  end

  def mass_update
    ActivityCategory.all.each do |extant_ac|
      ac = params[:activity_categories].find { |activity_category| activity_category[:id] == extant_ac.id }
      if ac
        extant_ac.assign_attributes(ac.except(:activity_ids, :created_at, :updated_at, :id).permit!)
        if extant_ac.changed?
          extant_ac.save
        end

        if extant_ac.activity_category_activities.order(order_number: :asc).map(&:activity_id) != ac[:activity_ids]
          extant_ac.activity_category_activities.destroy_all
          ac[:activity_ids].each_with_index { |id, index| ActivityCategoryActivity.create(activity_category_id: extant_ac.id, activity_id: id, order_number: index) }
        end
      else
        extant_ac.destroy
      end
    end
    render json: { activity_categories: format_activity_categories }
  end

  def create
    activity_category = ActivityCategory.create(activity_category_params)
    render json: { activity_category: activity_category }, status: 200
  end

  private

  def format_activity_categories
    @activity_categories = ActivityCategory.includes(:activity_category_activities).order(order_number: :asc).all.map do |ac|
      activity_category = ac.attributes
      activity_category['activity_ids'] = ac.activity_category_activities.order(order_number: :asc).map(&:activity_id)
      activity_category
    end
  end

  def activity_category_params
    params[:activity_category].permit(:name, :order_number)
  end
end
