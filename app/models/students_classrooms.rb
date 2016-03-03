class StudentsClassrooms < ActiveRecord::Base

  belongs_to :student, class_name: "User"
  belongs_to :classroom, class_name: "Classroom"
  validates :student, uniqueness: {scope: :classroom}

end
