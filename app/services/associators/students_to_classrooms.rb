module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    # student.students_classrooms.find_or_create_by(student_id: student.id, classroom_id: classroom.id)
    student.classrooms << classroom unless student.classrooms.include?(classroom)
    student.assign_classroom_activities
    student
  end

end
