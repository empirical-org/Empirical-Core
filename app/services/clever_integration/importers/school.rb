module CleverIntegration::Importers::School

  def self.run(teacher, district_token, teacher_requester)
    clever_teacher = teacher_requester.call(teacher.clever_id, district_token)
    parsed_response = CleverIntegration::Parsers::School.run(clever_teacher.school)
    school = CleverIntegration::Creators::School.run(parsed_response)
    teacher.update(school: school)
    school
  end


end
