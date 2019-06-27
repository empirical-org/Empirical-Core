module CleverIntegration::Importers::School

  def self.run(teacher, district_token, requesters)
    teacher_requester = requesters[:teacher_requester]
    school_requester = requesters[:school_requester]
    clever_teacher = teacher_requester(district_token, teacher.clever_id)
    clever_school = school_requester(district_token, clever_teacher.data.school)
    parsed_response = CleverIntegration::Parsers::School.run(clever_school)
    school = CleverIntegration::Creators::School.run(parsed_response)
    if school
      su = SchoolsUsers.find_or_initialize_by(user_id: teacher.id)
      su.update(school_id: school.id)
      school
    end
  end


end
