module CleverIntegration::Parsers::Students

  def self.run(students_response)
    parsed_response = students_response.map do |student_response|
      name = self.generate_name(student_response[:name][:first], student_response[:name][:last])
      {
        clever_id: student_response[:id],
        email: student_response[:email],
        name: name
      }
    end
    parsed_response
  end

  private

  def self.generate_name(first_name, last_name)
    NameUnifier.run(first_name, last_name)
  end
end