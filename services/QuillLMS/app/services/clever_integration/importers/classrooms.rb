module CleverIntegration::Importers::Classrooms

  def self.run(teacher, district_token, requesters)
    sections = self.fetch_clever_teacher(teacher.clever_id, district_token, requesters[:sections_for_teacher_requester])
    sections_response = sections.data
    parsed_sections_response = self.parse_sections_response(sections_response)
    classrooms = self.create_classrooms(parsed_sections_response)
    updated_classrooms = self.associate_classrooms_to_teacher(classrooms, teacher)
    updated_classrooms
  end

  private

  def self.fetch_clever_teacher(teacher_clever_id, district_token, sections_for_teacher_requester)
    sections_for_teacher_requester(district_token, teacher_clever_id)
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
