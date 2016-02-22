# used in clever_sync.rake (not in sign up)

module CleverIntegration::Sync::Main

  def self.run
    District.all.each do |district|
      self.setup_district(district)
    end
  end

  private

  def self.setup_district(district)
    teachers = self.import_teachers(district)
    schools = self.import_schools(teachers, district.token)
    classrooms = self.import_classrooms(teachers, district.token)
    students = self.import_students(classrooms, district.token)
  end

  def self.import_teachers(district)
    teachers = CleverIntegration::Importers::Teachers.run(district)
    teachers
  end

  def self.import_schools(teachers, district_token)
    CleverIntegration::Importers::Schools.run(teachers, district_token)
  end

  def self.import_classrooms(teachers, district_token)
    classrooms_arr_arr = teachers.map do |teacher|
      classrooms = self.import_classrooms_for_teacher(teacher, district_token)
      classrooms
    end
    classrooms = classrooms_arr_arr.flatten
    classrooms
  end

  def self.import_classrooms_for_teacher(teacher, district_token)
    CleverIntegration::Importers::Classrooms.run(teacher, district_token)
  end

  def self.import_students(classrooms, district.token)
    CleverIntegration::Importers::Students.run(classrooms, district_token)
  end
end