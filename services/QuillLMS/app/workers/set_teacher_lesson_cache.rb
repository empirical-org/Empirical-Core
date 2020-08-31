class SetTeacherLessonCache
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(teacher_id)
    @user = User.find_by(id: teacher_id)
    @user.set_lessons_cache if @user
  end

end
