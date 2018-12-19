class SetTeacherLessonCache
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  def perform(teacher_id)
    @user = Teacher.find(teacher_id)
    @user.set_lessons_cache
  end

end
