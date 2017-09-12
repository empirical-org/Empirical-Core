class Cms::ActivityCategoriesController < ApplicationController
  before_filter :staff!

  def index
    @activity_categories = ActivityCategory.order(order_number: :asc)
  end

  def update
  end

  def show
    @activity_category = ActivityCategory.find(params[:id])
    @activities = Activity.select("activities.id, activities.name, activity_category_activities.order_number")
    .joins('INNER JOIN activity_category_activities on activity_category_activities.activity_id = activities.id')
    .joins('INNER JOIN activity_categories on activity_category_activities.activity_category_id = activity_categories.id')
    .where('activity_categories.id = ?', @activity_category.id)
    .order('activity_category_activities.order_number').to_a
  end

  def update_order_numbers
    params[:activity_categories].each { |ac| ActivityCategory.find(ac['id']).update(order_number: ac['order_number'])}
    render json: {activity_categories: ActivityCategory.order(order_number: :asc)}
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
end
