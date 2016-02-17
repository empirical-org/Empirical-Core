module CleverIntegration::Importers::Students

  def self.run(classrooms, district_token)
    students_arr_of_arrs = classrooms.map do |classroom|
      self.import_students_for_single_classroom(classroom, district_token)
    end
    student_arr = students_arr_of_arrs.flatten
    student_arr
  end

  private

  def self.import_students_for_single_classroom(classroom, district_token)
    clever_section = self.fetch_clever_section(classroom.clever_id, district_token)
    students_response = clever_section.students
    parsed_students_response = self.parse_students_response(classroom, students_response)
    students = self.create_students(parsed_students_response)
    updated_students = self.associate_students_to_classroom(students, classroom)
    updated_students
  end

  def self.fetch_clever_section(classroom_clever_id, district_token)
    clever_section = Clever::Section.retrieve(classroom_clever_id, district_token)
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
    updated_students = CleverIntegration::Associators::StudentsToClassroom(students, classrooom)
    updated_students
  end
end