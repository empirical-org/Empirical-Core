class LessonPlanEmailWorker
  include Sidekiq::Worker

  def perform(user_id, lesson_ids, unit_id)
    @user = User.find(user_id)
    @lessons = Activity.where(id: lesson_ids)
      .joins("JOIN activity_category_activities AS aca ON aca.activity_id = activities.id")
      .joins("JOIN activity_categories AS ac ON ac.id = aca.activity_category_id")
      .order("ac.order_number, aca.order_number")
    @unit = Unit.find(unit_id)
    @user.send_lesson_plan_email(@lessons, @unit)
  end
end
