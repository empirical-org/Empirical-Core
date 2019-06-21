module CleverIntegration::Importers::SchoolAdminSchools

  def self.run(user, district_token, requesters)
    clever_user = requester.call(user.clever_id, district_token)
    parsed_response = clever_user.data.schools.map do |school|
      clever_school = requesters[:school_requester].call(school, district_token)
      CleverIntegration::Parsers::School.run(clever_school)
    end
    binding.pry
    parsed_response.each do |s|
      school = CleverIntegration::Creators::School.run(s)
      if school
        SchoolsAdmins.create(user_id: user.id, school_id: school.id)
        school
      end
    end
  end

end
