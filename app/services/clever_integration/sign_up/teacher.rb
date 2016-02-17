module CleverIntegration::SignUp::Teacher

  def self.run(auth_hash)
    parsed_data = self.parse_data(auth_hash)
    district = District.find_by(clever_id: parsed_data[:district_id])

    # TODO: error message for no district found (district has not authorized this school yet)
    return if district.nil?

    teacher = self.create_teacher(parsed_data)
    self.associate_teacher_to_district(teacher, district)
    clever_teacher = self.request_teacher_data_from_clever(parsed_data[:clever_id], district.token)
    sections = self.get_sections(clever_teacher)
    classrooms = self.create_classrooms(sections)

  end

  private

  def self.parse_data(auth_hash)
    CleverIntegration::Parsers::Teacher.run(auth_hash)
  end

  def self.create_teacher(parsed_data)
    CleverIntegration::Creators::Teacher.run(parsed_data)
  end

  def self.associate_teacher_to_district(teacher, district)
    CleverIntegration::Associator::TeacherDistrict.run(teacher, district)
  end

  def self.request_teacher_data_from_clever(teacher_clever_id, district_token)
    CleverIntegration::Requester::Teacher.run(teacher_clever_id, district_token)
  end

  def self.get_sections(clever_teacher)
    CleverIntegration::Requester::Sections.from_clever_teacher(clever_teacher)
  end

  def self.create_classrooms(sections)
    classrooms = sections.map do |section|
      parsed_data = CleverIntegration::Parser::Section.run(section)
      classroom = CleverIntegration::Creator::Classroom.run(parsed_data)
    end
    classrooms
  end
end