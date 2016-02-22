module CleverIntegration::Importers::School

  def self.run(teacher, district_token)
    clever_teacher = Clever::Teacher.retrieve(teacher.clever_id, district_token)
    clever_school = clever_teacher[:school]
    parsed_response = self.parse_response(clever_school)
    school = self.create_school(parsed_response)
    school2 = self.associate_school_to_teacher(school, teacher)
    school2
  end


  private

  def self.parse_response(response)
    parsed_response = CleverIntegration::Parsers::School.run(response)
    parsed_response
  end

  def self.create_school(parsed_response)
    school = CleverIntegration::Creators::School.run(parsed_response)
    school
  end

  def self.associate_school_to_teacher(school, teacher)
    school = CleverIntegration::Associators::SchoolToTeacher(teacher, school)
    school
  end
end