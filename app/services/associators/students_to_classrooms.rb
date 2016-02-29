module Associators::StudentsToClassrooms

  def self.run(student, classroom)
    student.classrooms << classroom unless student.classrooms.include?(classroom)
    student
  end

end
