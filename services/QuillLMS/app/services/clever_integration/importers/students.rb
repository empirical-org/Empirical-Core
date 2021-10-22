module CleverIntegration::Importers::Students

  def self.run(classrooms, district_token)
    students_arr_of_arrs = classrooms.map do |classroom|
      students = import_students_for_single_classroom(classroom, district_token)
      students
    end
    students = students_arr_of_arrs.flatten
    students
  end

  def self.import_students_for_single_classroom(classroom, district_token)
    clever_section = fetch_clever_section(classroom.clever_id, district_token)
    students_data = clever_section.data
    parsed_students_data = parse_students_data(students_data)
    students = create_students(parsed_students_data)
    updated_students = associate_students_to_classroom(students, classroom)
    update_provider_classroom_users(classroom.clever_id, students.map(&:clever_id).compact)
    updated_students
  end

  def self.update_provider_classroom_users(classroom_clever_id, students_clever_ids)
    ProviderClassroomUsersUpdater.new(classroom_clever_id, students_clever_ids, CleverClassroomUser).run
  end

  def self.fetch_clever_section(classroom_clever_id, district_token)
    CleverIntegration::Requesters.students_for_section(classroom_clever_id, district_token)
  end

  def self.parse_students_data(students_data)
    CleverIntegration::Parsers::Students.run(students_data)
  end

  def self.create_students(parsed_students_data)
    parsed_students_data.map { |data| CleverIntegration::StudentImporter.new(data).run }
  end

  def self.associate_students_to_classroom(students, classroom)
    CleverIntegration::Associators::StudentsToClassroom.run(students, classroom)
  end
end
