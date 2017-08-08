class StudentsClassrooms < ActiveRecord::Base
  
  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  # validates uniqueness of student/classroom on db
  after_save :checkbox
  after_commit :invalidate_student_count

  default_scope { where(visible: true)}

  def archived_classrooms_manager
    {joinDate: self.created_at.strftime("%m/%d/%Y"), className: self.classroom.name, teacherName: self.classroom.teacher.name, id: self.id}
  end

  def invalidate_student_count
    $redis.del("classroom_id:#{self.classroom_id}_student_count")
  end

  private

  def checkbox
    if self.classroom
      Checkbox.find_or_create_checkbox('Add Students', self.classroom.teacher)
    end
  end

end
