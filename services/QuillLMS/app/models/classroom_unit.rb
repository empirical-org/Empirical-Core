# == Schema Information
#
# Table name: classroom_units
#
#  id                   :integer          not null, primary key
#  assign_on_join       :boolean          default(FALSE)
#  assigned_student_ids :integer          default([]), is an Array
#  visible              :boolean          default(TRUE)
#  created_at           :datetime
#  updated_at           :datetime
#  classroom_id         :integer          not null
#  unit_id              :integer          not null
#
# Indexes
#
#  index_classroom_units_on_classroom_id              (classroom_id)
#  index_classroom_units_on_unit_id                   (unit_id)
#  index_classroom_units_on_unit_id_and_classroom_id  (unit_id,classroom_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (unit_id => units.id)
#
class ClassroomUnit < ActiveRecord::Base
  include ::NewRelic::Agent
  include AtomicArrays

  belongs_to :unit #, touch: true
  belongs_to :classroom
  has_many :activity_sessions
  has_many :classroom_unit_activity_states

  validates :unit, uniqueness: { scope: :classroom }
  before_save :check_for_assign_on_join_and_update_students_array_if_true
  after_save  :hide_appropriate_activity_sessions

  # this method does not seem to be getting used, but leaving it in for the tests for now
  def assigned_students
    User.where(id: assigned_student_ids)
  end

  def is_valid_for_google_announcement_with_specific_user?(user)
    !!classroom.google_classroom_id && !!user.google_id && !!user.post_google_classroom_assignments
  end

  def is_valid_for_google_announcement_with_owner?
    !!classroom.google_classroom_id && !!classroom.owner.google_id && !!classroom.owner.post_google_classroom_assignments
  end

  def validate_assigned_student(student_id)
    if assign_on_join
      if !assigned_student_ids || assigned_student_ids.exclude?(student_id)
        if !assigned_student_ids.is_a?(Array)
          update(assigned_student_ids: [])
        end
        update(assigned_student_ids: StudentsClassrooms.where(classroom_id: classroom_id).pluck(:student_id))
      end
      true
    else
      assigned_student_ids && assigned_student_ids.include?(student_id)
    end
  end

  def teacher_and_classroom_name
    {teacher: classroom&.owner&.name, classroom: classroom&.name}
  end

  def remove_assigned_student(student_id)
    new_assigned_student_ids = assigned_student_ids - [student_id]
    # we need to set assign_on_join to false so that the student doesn't get added back
    # in by the #check_for_assign_on_join_and_update_students_array_if_true method.
    # if assign on join should still be true the aforementioned method will set it.
    update(assigned_student_ids: new_assigned_student_ids, assign_on_join: false)
  end


  private def hide_unassigned_activity_sessions
    #validate or hides any other related activity sessions
    if activity_sessions.present?
      activity_sessions.each do |as|
        # We are explicitly checking to ensure that the student here actually belongs
        # in this classroom before running the validate_assigned_student method because
        # if this is not true, validate_assigned_student starts an infinite loop!
        if !StudentsClassrooms.find_by(classroom_id: classroom_id, student_id: as.user_id)
          as.update(visible: false)
        elsif !validate_assigned_student(as.user_id)
          as.update(visible: false)
        end
      end
    end
  end

  private def hide_all_activity_sessions
    activity_sessions.update_all(visible: false)
  end

  private def hide_appropriate_activity_sessions
    # on save callback that checks if archived
    if visible == false
      hide_all_activity_sessions
      return
    end
    hide_unassigned_activity_sessions
  end

  private def check_for_assign_on_join_and_update_students_array_if_true
    student_ids = StudentsClassrooms.where(classroom_id: classroom_id).pluck(:student_id)
    if assigned_student_ids&.any? && !assign_on_join && assigned_student_ids.length >= student_ids.length
      # then maybe it should be assign on join, so we do a more thorough check
      if (assigned_student_ids - student_ids).empty?
        # then it should indeed be assigned to all
        self.assign_on_join = true
      end
    end
    if assign_on_join
      # then we ensure that it has all the student ids
      self.assigned_student_ids = student_ids
    end
  end
end
