# frozen_string_literal: true

module CleverIntegration::Importers::Classrooms
  def self.run(teacher, district_token)
    sections = fetch_clever_teacher(teacher.clever_id, district_token)
    sections_response = sections.data
    sections_data = parse_sections_response(sections_response)
    teacher_sections_data = sections_data.map { |section_data| section_data.merge(teacher_id: teacher.id) }
    classrooms = create_classrooms(teacher_sections_data)
    classrooms
  end

  def self.fetch_clever_teacher(teacher_clever_id, district_token)
    CleverIntegration::Requesters.sections_for_teacher(teacher_clever_id, district_token)
  end

  def self.parse_sections_response(sections_response)
    CleverIntegration::Parsers::Sections.run(sections_response)
  end

  def self.create_classrooms(sections_data)
    sections_data.map { |section_data| CleverIntegration::ClassroomImporter.run(section_data) }
  end
end
