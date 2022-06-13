# frozen_string_literal: true

class Cms::ActivityCategoriesController < Cms::CmsController
  def index
    render json: { activity_categories: format_activity_categories }
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def mass_update
    ActivityCategory.all.each do |existing_ac|
      ac = params[:activity_categories].find { |activity_category| activity_category[:id].to_i == existing_ac.id }
      if ac
        existing_ac.assign_attributes(ac.except(:activity_ids, :created_at, :updated_at, :id).permit!)
        if existing_ac.changed?
          existing_ac.save
        end

        if existing_ac.activity_category_activities.order(order_number: :asc).map(&:activity_id) != ac[:activity_ids]
          existing_ac.activity_category_activities.destroy_all
          ac[:activity_ids].each_with_index { |id, index| ActivityCategoryActivity.create(activity_category_id: existing_ac.id, activity_id: id, order_number: index) }
        end
      else
        existing_ac.destroy
      end
    end
    render json: { activity_categories: format_activity_categories }
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def create
    activity_category = ActivityCategory.create(activity_category_params)
    render json: { activity_category: format_activity_category(activity_category) }, status: 200
  end

  private def format_activity_categories
    @activity_categories = ActivityCategory.includes(:activity_category_activities).order(order_number: :asc).all.map do |ac|
      format_activity_category(ac)
    end
  end

  private def format_activity_category(ac_record)
    activity_category = ac_record.attributes
    activity_category['activity_ids'] = ac_record.activity_category_activities.order(order_number: :asc).map(&:activity_id)
    activity_category
  end

  private def activity_category_params
    params[:activity_category].permit(:name, :order_number)
  end
end
