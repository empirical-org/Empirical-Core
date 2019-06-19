module CleverIntegration::Importers::SchoolAdminSchools

  def self.run(user, district_token, requester)
    clever_user = requester.call(user.clever_id, district_token)
    parsed_response = clever_user.schools.each { |school| CleverIntegration::Parsers::School.run(school) }
    parsed_response.each do |s|
      school = CleverIntegration::Creators::School.run(s)
      if school
        SchoolsAdmins.create(user_id: user.id, school_id: school.id)
        school
      end
    end
  end

end
