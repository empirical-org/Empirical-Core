class LessonPlanEmailWorker
  include Sidekiq::Worker

  def perform(user_id, lesson_id)
    @user = User.find(user_id)
    @lesson = Activity.find(lesson_id)
    @user.send_lesson_plan_email(@lesson)
  end
end
