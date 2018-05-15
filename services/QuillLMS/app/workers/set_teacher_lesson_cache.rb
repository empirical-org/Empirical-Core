class SetTeacherLessonCache
  include Sidekiq::Worker

  def perform(teacher_id)
    @user = Teacher.find(teacher_id)
    @user.set_lessons_cache
  end

end
