module CleverIntegration::Creators::Students

  def self.run(parsed_students_response)
    students = parsed_students_response.map do |parsed_student_response|
      student = self.create_student(parsed_student_response)
      student
    end
    students
  end

  private

  def self.create_student(parsed_student_response)
    student = User.find_or_initialize_by(parsed_student_response[:clever_id])
    student = student.update({
      name: parsed_student_response[:name],
      email: parsed_student_response[:email]
    })
    student
  end
end