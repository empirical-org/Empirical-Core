class GetActivitiesQuery
  def initialize(activity_category_id)
    @activity_category_id = activity_category_id
  end

  def run
    Activity.select("activities.id, activities.name, activity_category_activities.order_number")
      .joins('INNER JOIN activity_category_activities on activity_category_activities.activity_id = activities.id')
      .joins('INNER JOIN activity_categories on activity_category_activities.activity_category_id = activity_categories.id')
      .where('activity_categories.id = ?', activity_category_id)
      .order('activity_category_activities.order_number').to_a
  end

  attr_reader :activity_category_id
  private :activity_category_id
end