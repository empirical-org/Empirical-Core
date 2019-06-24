module CleverIntegration::Importers::School

  def self.run(teacher, district_token, requester)
    clever_teacher = requester.call(teacher.clever_id, district_token)
    parsed_response = CleverIntegration::Parsers::School.run(clever_teacher.school)
    binding.pry
    school = CleverIntegration::Creators::School.run(parsed_response)
    if school
      su = SchoolsUsers.find_or_initialize_by(user_id: teacher.id)
      su.update(school_id: school.id)
      school
    end
  end


end
