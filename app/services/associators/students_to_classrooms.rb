module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    student.classrooms << classroom unless student.classrooms.include?(classroom)
    student.assign_classroom_activities
    student
  end

end
