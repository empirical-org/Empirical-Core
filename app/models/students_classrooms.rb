class StudentsClassrooms < ActiveRecord::Base

  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  validates :student, uniqueness: {scope: :classroom}

  default_scope { where(visible: true)}


  def students_classrooms_manager
    {joinDate: self.created_at.strftime("%m/%d/%Y"), className: self.classroom.name, teacherName: self.classroom.teacher.name, id: self.id}
  end

end
