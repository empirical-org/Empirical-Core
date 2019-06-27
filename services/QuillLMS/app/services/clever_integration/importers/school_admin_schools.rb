module CleverIntegration::Importers::SchoolAdminSchools

  def self.run(user, district_token, requesters)
    requester = requesters[:schools_for_school_admin_requester]
    schools_for_admin_user = requester(district_token, user.clever_id)
    parsed_response = schools_for_admin_user.data.map do |school|
      CleverIntegration::Parsers::School.run(school)
    end
    parsed_response.each do |s|
      school = CleverIntegration::Creators::School.run(s)
      if school
        SchoolsAdmins.create(user_id: user.id, school_id: school.id)
        school
      end
    end
  end

end
