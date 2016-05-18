module CleverIntegration::SignUp::Teacher

  def self.run(auth_hash, requesters)
    parsed_data = self.parse_data(auth_hash)
    district = District.find_by(clever_id: parsed_data[:district_id])

    # TODO: error message for no district found (district has not authorized this school yet)
    if district.nil?
      result = {type: 'user_failure', data: "District has not authorized this school yet"}
    else
      teacher = self.create_teacher(parsed_data)
      if teacher.present?
        self.associate_teacher_to_district(teacher, district)
        puts "Associated Teacher to district"
        school = self.import_school(teacher, district.token, requesters)
        puts "Imported School"
        classrooms = self.import_classrooms(teacher, district.token, requesters)
        puts "Imported Classrooms"
        students = self.import_students(classrooms, district.token, requesters)
        puts "Imported Students"
        result = {type: 'user_success', data: teacher}
      else
        puts "No teacher present"
        result = {type: 'user_failure', data: "No Teacher Present"}
      end
    end
    result
  end

  private

  def self.parse_data(auth_hash)
    CleverIntegration::Parsers::TeacherFromAuth.run(auth_hash)
  end

  def self.create_teacher(parsed_data)
    CleverIntegration::Creators::Teacher.run(parsed_data)
  end

  def self.associate_teacher_to_district(teacher, district)
    CleverIntegration::Associators::TeacherToDistrict.run(teacher, district)
  end

  def self.import_school(teacher, district_token, requesters)
    CleverIntegration::Importers::School.run(teacher, district_token, requesters[:teacher_requester])
  end

  def self.import_classrooms(teacher, district_token, requesters)
    CleverIntegration::Importers::Classrooms.run(teacher, district_token, requesters[:teacher_requester])
  end

  def self.import_students(classrooms, district_token, requesters)
    classroom_ids = classroom_ids.collect {|c| c.id}
    CleverStudentImporterWorker.perform_async(classroom_ids, district_token, requesters)
    # CleverIntegration::Importers::Students.run(classrooms, district_token, requesters[:section_requester])
  end
end
