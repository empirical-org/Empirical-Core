module CleverIntegration::SignUp::Teacher

  def self.run(auth_hash, requesters)
    parsed_data = self.parse_data(auth_hash)
    district = District.find_by(clever_id: parsed_data[:district_id])

    # TODO: error message for no district found (district has not authorized this school yet)
    return if district.nil?

    teacher = self.create_teacher(parsed_data)
    self.associate_teacher_to_district(teacher, district)

    school = self.import_school(teacher, district.token, requesters)
    classrooms = self.import_classrooms(teacher, district.token, requesters)
    students = self.import_students(classrooms, district.token, requesters)
  end

  private

  def self.parse_data(auth_hash)
    CleverIntegration::Parsers::TeacherFromAuth.run(auth_hash)
  end

  def self.create_teacher(parsed_data)
    CleverIntegration::Creators::Teacher.run(parsed_data)
  end

  def self.associate_teacher_to_district(teacher, district)
    CleverIntegration::Associator::TeacherToDistrict.run(teacher, district)
  end

  def self.import_school(teacher, district_token, requesters)
    CleverIntegration::Importers::School.run(teacher, district_token, requesters[:teacher_requester])
  end

  def self.import_classrooms(teacher, district_token, requesters)
    CleverIntegration::Importers::Classrooms(teacher_id, teacher_clever_id, district_token, requesters[:teacher_requester])
  end

  def self.import_students(classrooms, district_token, requesters)
    CleverIntegration::Importers::Students(classrooms, district_token, requesters[:section_requester])
  end
end