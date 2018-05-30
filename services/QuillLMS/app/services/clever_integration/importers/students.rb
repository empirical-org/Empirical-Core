module CleverIntegration::Importers::Students

  def self.run(classrooms, district_token, section_requester)
    students_arr_of_arrs = classrooms.map do |classroom|
      students = self.import_students_for_single_classroom(classroom, district_token, section_requester)
      students
    end
    students = students_arr_of_arrs.flatten
    students
  end

  private

  def self.import_students_for_single_classroom(classroom, district_token, section_requester)
    clever_section = self.fetch_clever_section(classroom.clever_id, district_token, section_requester)
    students_response = clever_section.students
    parsed_students_response = self.parse_students_response(students_response)
    students = self.create_students(parsed_students_response)
    updated_students = self.associate_students_to_classroom(students, classroom)
    updated_students
  end

  def self.fetch_clever_section(classroom_clever_id, district_token, section_requester)
    clever_section = section_requester.call(classroom_clever_id, district_token)
    clever_section
  end

  def self.parse_students_response(students_response)
    parsed_students_response = CleverIntegration::Parsers::Students.run(students_response)
    parsed_students_response
  end

  def self.create_students(parsed_students_response)
    students = CleverIntegration::Creators::Students.run(parsed_students_response)
    students
  end

  def self.associate_students_to_classroom(students, classroom)
    updated_students = CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
    updated_students
  end
end