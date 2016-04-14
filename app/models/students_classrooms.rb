class StudentsClassrooms < ActiveRecord::Base

  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  validates :student, uniqueness: {scope: :classroom}

  default_scope { where(visible: true)}


  def students_classrooms_manager
    {joinDate: self.created_at, className: self.classroom.name, teacherName: self.teacher_name}
  end

end
