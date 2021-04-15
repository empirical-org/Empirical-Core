module CleverIntegration::SignUp::Teacher

  def self.run(auth_hash)
    parsed_data = parse_data(auth_hash)

    if !parsed_data
      {type: 'user_failure', data: "Could not parse Clever data", redirect: '/'}
    elsif parsed_data[:district_id]
      district = import_district(parsed_data[:district_id])
      district_integration(parsed_data, district)
    else
      library_integration(auth_hash)
    end
  end

  def self.library_integration(auth_hash)
    CleverIntegration::Importers::Library.run(auth_hash)
  end

  def self.district_integration(auth_hash, district)
    teacher = create_teacher(auth_hash)
    if teacher.present?
      associate_teacher_to_district(teacher, district)
      school = import_school(teacher, district.token)
      classrooms = import_classrooms(teacher, district.token)
      students = import_students(classrooms, district.token)
      {type: 'user_success', data: teacher}
    else
      {type: 'user_failure', data: "No Teacher Present"}
    end
  end

  def self.parse_data(auth_hash)
    CleverIntegration::Parsers::TeacherFromAuth.run(auth_hash)
  end

  def self.create_teacher(parsed_data)
    CleverIntegration::Creators::Teacher.run(parsed_data)
  end

  def self.associate_teacher_to_district(teacher, district)
    CleverIntegration::Associators::TeacherToDistrict.run(teacher, district)
  end

  def self.import_district(district_id)
    CleverIntegration::Importers::CleverDistrict.run(district_id: district_id)
  end

  def self.import_school(teacher, district_token)
    CleverIntegration::Importers::School.run(teacher, district_token)
  end

  def self.import_classrooms(teacher, district_token)
    CleverIntegration::Importers::Classrooms.run(teacher, district_token)
  end

  def self.import_students(classrooms, district_token)
    classroom_ids = classrooms.collect {|c| c.id}
    CleverStudentImporterWorker.perform_async(classroom_ids, district_token)
  end
end
