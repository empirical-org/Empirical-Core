class ClassroomsTeacher < ActiveRecord::Base
  belongs_to :user
  belongs_to :classroom

  after_create :delete_classroom_minis_cache_for_each_teacher_of_this_classroom, :reset_lessons_cache_for_teacher
  before_destroy :delete_classroom_minis_cache_for_each_teacher_of_this_classroom, :reset_lessons_cache_for_teacher

  ROLE_TYPES = {coteacher: 'coteacher', owner: 'owner'}

  def teacher
    user
  end

  private

  def delete_classroom_minis_cache_for_each_teacher_of_this_classroom
    Classroom.unscoped.find(classroom_id).teachers.ids.each do |id|
      $redis.del("user_id:#{id}_classroom_minis")
    end
  end

  def reset_lessons_cache_for_teacher
    ResetLessonCacheWorker.perform_async(user_id)
  end

end
