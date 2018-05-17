module CleverIntegration::Associators::StudentsToClassroom

  def self.run(students, classroom)
    updated_students = students.map do |student|
      ::Associators::StudentsToClassrooms.run(student, classroom)
    end
    updated_students
  end
end