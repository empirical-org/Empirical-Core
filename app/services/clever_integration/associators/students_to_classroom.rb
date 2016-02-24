module CleverIntegration::Associators::StudentsToClassroom

  def self.run(students, classroom)
    updated_students = students.map do |student|
      student.update(classcode: classroom.code)
      student.reload
    end
    updated_students
  end
end