module CleverIntegration::Importers::Classrooms

  def self.run(teacher, district_token, teacher_requester)
    clever_teacher = self.fetch_clever_teacher(teacher.clever_id, district_token, teacher_requester)
    sections_response = clever_teacher.sections
    parsed_sections_response = self.parse_sections_response(sections_response)
    classrooms = self.create_classrooms(parsed_sections_response)
    updated_classrooms = self.associate_classrooms_to_teacher(classrooms, teacher)
    updated_classrooms
  end

  private

  def self.fetch_clever_teacher(teacher_clever_id, district_token, teacher_requester)
    teacher_requester.call(teacher_clever_id, district_token)
  end

  def self.parse_sections_response(sections_response)
    CleverIntegration::Parsers::Sections.run(sections_response)
  end

  def self.create_classrooms(parsed_sections_response)
    CleverIntegration::Creators::Classrooms.run(parsed_sections_response)
  end

  def self.associate_classrooms_to_teacher(classrooms, teacher)
    CleverIntegration::Associators::ClassroomsToTeacher.run(classrooms, teacher)
  end
end
