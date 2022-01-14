# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms_teachers
#
#  id           :integer          not null, primary key
#  order        :integer
#  role         :string           not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer          not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_classrooms_teachers_on_classroom_id             (classroom_id)
#  index_classrooms_teachers_on_role                     (role)
#  index_classrooms_teachers_on_user_id                  (user_id)
#  unique_classroom_and_user_ids_on_classrooms_teachers  (user_id,classroom_id) UNIQUE
#
class ClassroomsTeacher < ApplicationRecord
  belongs_to :user
  belongs_to :classroom, touch: true

  after_create :delete_classroom_minis_cache_for_each_teacher_of_this_classroom, :reset_lessons_cache_for_teacher
  before_destroy :delete_classroom_minis_cache_for_each_teacher_of_this_classroom, :reset_lessons_cache_for_teacher

  ROLE_TYPES = {coteacher: 'coteacher', owner: 'owner'}

  def teacher
    user
  end

  private def delete_classroom_minis_cache_for_each_teacher_of_this_classroom
    Classroom.unscoped.find(classroom_id).teachers.ids.each do |id|
      $redis.del("user_id:#{id}_classroom_minis")
    end
  end

  private def reset_lessons_cache_for_teacher
    ResetLessonCacheWorker.perform_async(user_id)
  end

end
