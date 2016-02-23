# used in clever_sync.rake (not in sign up)

module CleverIntegration::Sync::Main

  def self.run(requesters)
    District.all.each do |district|
      self.setup_district(district, requesters)
    end
  end

  private

  def self.setup_district(district, requesters)
    teachers = self.import_teachers(district, requesters[:district_requester])
    schools = self.import_schools(teachers, district.token, requesters[:teacher_requester])
    classrooms = self.import_classrooms(teachers, district.token, requesters[:teacher_requester])
    students = self.import_students(classrooms, district.token, requesters[:section_requester])
  end

  def self.import_teachers(district, district_requester)
    teachers = CleverIntegration::Importers::Teachers.run(district, district_requester)
    teachers
  end

  def self.import_schools(teachers, district_token, teacher_requester)
    schools = CleverIntegration::Importers::Schools.run(teachers, district_token, teacher_requester)
    schools
  end

  def self.import_classrooms(teachers, district_token, teacher_requester)
    classrooms_arr_arr = teachers.map do |teacher|
      classrooms = self.import_classrooms_for_teacher(teacher, district_token, teacher_requester)
      classrooms
    end
    classrooms = classrooms_arr_arr.flatten
    classrooms
  end

  def self.import_classrooms_for_teacher(teacher, district_token, teacher_requester)
    classrooms = CleverIntegration::Importers::Classrooms.run(teacher, district_token, teacher_requester)
    classrooms
  end

  def self.import_students(classrooms, district_token, section_requester)
    students = CleverIntegration::Importers::Students.run(classrooms, district_token, section_requester)
    students
  end
end