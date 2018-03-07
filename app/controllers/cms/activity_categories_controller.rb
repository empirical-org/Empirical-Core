class Cms::ActivityCategoriesController < Cms::CmsController
  def index
    @activity_categories = ActivityCategory.order(order_number: :asc)
  end

  def update
  end

  def show
    @activity_category = ActivityCategory.find(params[:id])
    @activities = get_activities_query(@activity_category.id)
  end

  def update_order_numbers
    params[:activity_categories].each { |ac| ActivityCategory.find(ac['id']).update(order_number: ac['order_number'])}
    render json: {activity_categories: ActivityCategory.order(order_number: :asc)}
  end

  def destroy_and_recreate_acas
    new_activity_category_activities = params[:activities]
    ActivityCategory.find(params[:activity_category_id]).activity_category_activities.destroy_all
    errors = []
    new_activity_category_activities.each do |activity, i|
      aca = ActivityCategoryActivity.new
      aca.activity_id = activity['id']
      aca.order_number = activity['order_number'] || i
      aca.activity_category_id = params[:activity_category_id]
      aca.save!
      errors << aca.errors if aca.errors.any?
    end
    unless errors.any?
      render json: { activities: get_activities_query(params[:activity_category_id]) }, status: 200
    else
      render json: { errors: errors }, status: 500
    end
  end

  def create
    ActivityCategory.create(params[:activity_category].permit(:name, :order_number))
    return redirect_to cms_activity_categories_path
  end

  def destroy
    activity_category = ActivityCategory.find(params[:id])
    activity_category.destroy
    if activity_category.errors.any?
      render json: activity_category.errors, status: 400
    else
      render json: {}, status: 200
    end
  end

  private
  def get_activities_query(activity_category_id)
    Activity.select("activities.id, activities.name, activity_category_activities.order_number")
    .joins('INNER JOIN activity_category_activities on activity_category_activities.activity_id = activities.id')
    .joins('INNER JOIN activity_categories on activity_category_activities.activity_category_id = activity_categories.id')
    .where('activity_categories.id = ?', activity_category_id)
    .order('activity_category_activities.order_number').to_a
  end
end
