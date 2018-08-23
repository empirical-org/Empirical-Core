class ClassroomUnit < ActiveRecord::Base
  include ::NewRelic::Agent
  include AtomicArrays

  belongs_to :unit, touch: true
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
    !!self.classroom.google_classroom_id && !!user.google_id
  end

  def is_valid_for_google_announcement_with_owner?
    !!self.classroom.google_classroom_id && !!self.classroom.owner.google_id
  end

  def validate_assigned_student(student_id)
    if self.assign_on_join
      if !self.assigned_student_ids || self.assigned_student_ids.exclude?(student_id)
        if !self.assigned_student_ids.kind_of?(Array)
          self.update(assigned_student_ids: [])
        end
        self.update(assigned_student_ids: StudentsClassrooms.where(classroom_id: self.classroom_id).pluck(:student_id))
      end
      true
    else
      self.assigned_student_ids && self.assigned_student_ids.include?(student_id)
    end
  end

  def teacher_and_classroom_name
    {teacher: self.classroom&.owner&.name, classroom: self.classroom&.name}
  end

  private

  def hide_unassigned_activity_sessions
    #validate or hides any other related activity sessions
    if activity_sessions.present?
      activity_sessions.each do |as|
        # We are explicitly checking to ensure that the student here actually belongs
        # in this classroom before running the validate_assigned_student method because
        # if this is not true, validate_assigned_student starts an infinite loop! 😨
        if !StudentsClassrooms.find_by(classroom_id: self.classroom_id, student_id: as.user_id)
          as.update(visible: false)
        elsif !validate_assigned_student(as.user_id)
          as.update(visible: false)
        end
      end
    end
  end

  def hide_all_activity_sessions
    self.activity_sessions.update_all(visible: false)
  end

  def hide_appropriate_activity_sessions
    # on save callback that checks if archived
    if self.visible == false
      hide_all_activity_sessions
      return
    end
    hide_unassigned_activity_sessions
  end

  def check_for_assign_on_join_and_update_students_array_if_true
    student_ids = StudentsClassrooms.where(classroom_id: self.classroom_id).pluck(:student_id)
    if self.assigned_student_ids&.any? && !self.assign_on_join && self.assigned_student_ids.length >= student_ids.length
      # then maybe it should be assign on join, so we do a more thorough check
      if (assigned_student_ids - student_ids).empty?
        # then it should indeed be assigned to all
        self.assign_on_join = true
      end
    end
    if self.assign_on_join
      # then we ensure that it has all the student ids
      self.assigned_student_ids = student_ids
    end
  end
end
