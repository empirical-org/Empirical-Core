class Cms::ActivityCategoriesController < Cms::CmsController
  before_filter :set_activity_category, only: [:destroy, :show]

  def index
    respond_to do |format|
      format.json {
        render json: { activity_categories: format_activity_categories }
      }
    end
  end

  def update
  end

  def show
    @activities = get_activities_query(@activity_category.id)
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

  def format_activity_categories
    @activity_categories = ActivityCategory.includes(:activity_category_activities).order(order_number: :asc).all.map do |ac|
      activity_category = ac.attributes
      activity_category['activity_ids'] = ac.activity_category_activities.order(order_number: :asc).map(&:activity_id)
      activity_category
    end
  end

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
