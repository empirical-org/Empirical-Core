class Cms::ActivityCategoriesController < Cms::CmsController
  before_filter :set_activity_category, only: [:destroy, :show]

  def index
    @activity_categories = ActivityCategory.order(order_number: :asc)

    respond_to do |format|
      format.json {
        render json: { activity_categories: @activity_categories }
      }
    end
  end

  def update
  end

  def show
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
    if errors.any?
      render json: { errors: errors }, status: 500
    else
      render json: { activities: get_activities_query(params[:activity_category_id]) }, status: 200
    end
  end

  def create
    activity_category = ActivityCategory.create(activity_category_params)
    render json: { activity_category: activity_category }, status: 200
  end

  def destroy
    @activity_category.destroy
    if @activity_category.errors.any?
      render json: @activity_category.errors, status: 400
    else
      render json: {}, status: 200
    end
  end

  private

  def set_activity_category
    @activity_category = ActivityCategory.find(params[:id])
  end

  def activity_category_params
    params[:activity_category].permit(:name, :order_number)
  end

  def get_activities_query(activity_category_id)
    GetActivitiesQuery.new(activity_category_id).run
  end
end
