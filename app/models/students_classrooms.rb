class StudentsClassrooms < ActiveRecord::Base
  include CheckboxCallback
  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  # validates uniqueness of student/classroom on db
  after_save :checkbox
  after_commit :invalidate_classroom_minis

  default_scope { where(visible: true)}

  def archived_classrooms_manager
    {joinDate: self.created_at.strftime("%m/%d/%Y"), className: self.classroom.name, teacherName: self.classroom.teacher.name, id: self.id}
  end

  private

  def checkbox
    if self.classroom
      find_or_create_checkbox('Add Students', self.classroom.teacher)
    end
  end

  def invalidate_classroom_minis
    $redis.del("user_id:#{self.classroom.teacher_id}_classroom_minis")
  end

end
