class StudentsClassrooms < ActiveRecord::Base
  include CheckboxCallback
  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  # validates uniqueness of student/classroom on db
  after_save :checkbox, :run_associator
  after_save :archive_student_associations_for_classroom, if: Proc.new { |sc| !sc.visible && sc.student && sc.classroom }
  after_commit :invalidate_classroom_minis

  default_scope { where(visible: true)}

  def archived_classrooms_manager
    {joinDate: self.created_at.strftime("%m/%d/%Y"), className: self.classroom.name, teacherName: self.classroom.owner.name, id: self.id}
  end

  def archive_student_associations_for_classroom
    student_id = self.student_id
    classroom_units = ClassroomUnit.where(classroom_id: self.classroom_id).where.contains(assigned_student_ids: [student_id])
    classroom_unit_ids = []
    classroom_units.each do |cu|
      classroom_unit_ids.push(cu.id)
      new_assigned_student_ids = cu.assigned_student_ids - [student_id]
      cu.update(assigned_student_ids: new_assigned_student_ids)
    end
    activity_sessions = ActivitySession.where(user_id: student_id, classroom_unit_id: classroom_unit_ids)
    activity_sessions.update_all(visible: false)
  end

  private

  def run_associator
    if self.student && self.classroom && self.visible
      Associators::StudentsToClassrooms.run(self.student, self.classroom)
    end
  end

  def checkbox
    if self.classroom
      find_or_create_checkbox('Add Students', self.classroom.owner)
    end
  end

  def invalidate_classroom_minis
    if classroom.owner.present?
      $redis.del("user_id:#{self.classroom.owner.id}_classroom_minis")
    end
  end
end
