module CleverIntegration::Parsers::Students

  def self.run(students_response)
    parsed_response = students_response.map do |student_response|
      self.parse_student(student_response)
    end
    parsed_response
  end

  private

  def self.parse_student(student_response)
    CleverIntegration::Parsers::Student.run(student_response)
  end
end