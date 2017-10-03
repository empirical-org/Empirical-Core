class LessonPlanEmailWorker
  include Sidekiq::Worker

  def perform(user_id, lesson_ids, unit_id)
    @user = User.find(user_id)
    @lessons = Activity.where(id: lesson_ids)
    @unit = Unit.find(unit_id)
    @user.send_lesson_plan_email(@lessons, @unit)
  end
end
