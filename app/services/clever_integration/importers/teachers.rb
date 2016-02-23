module CleverIntegration::Importers::Teachers

  def self.run(district, district_requester)
    clever_district = district_requester.call(district.clever_id, district.token)
    clever_teachers = clever_district.teachers
    teachers = self.parse_and_create_teachers(clever_teachers)
    teachers2 = self.associate_teachers_to_district(teachers, district)
    teachers2
  end

  private

  def self.parse_and_create_teachers(clever_teachers)
    teachers = clever_teachers.map do |clever_teacher|
      self.parse_and_create_teacher(clever_teacher)
    end
    teachers
  end

  def self.parse_and_create_teacher(clever_teacher)
    parsed  = CleverIntegration::Parsers::Teacher.run(clever_teacher)
    teacher = CleverIntegration::Creators::Teacher.run(parsed)
    teacher
  end

  def self.associate_teachers_to_district(teachers, district)
    teachers2 = teachers.map do |teacher|
      self.associate_teacher_to_district(teacher, district)
    end
    teachers2
  end

  def self.associate_teacher_to_district(teacher, district)
    teacher = CleverIntegration::Associators::TeacherToDistrict.run(teacher, district)
    teacher
  end
end