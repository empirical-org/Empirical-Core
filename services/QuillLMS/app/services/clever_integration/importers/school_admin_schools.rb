# frozen_string_literal: true

module CleverIntegration::Importers::SchoolAdminSchools

  def self.run(user, district_token)
    schools_for_admin_user = CleverIntegration::Requesters.schools_for_school_admin(user.clever_id, district_token)
    parsed_response = schools_for_admin_user.data.map do |school|
      CleverIntegration::Parsers::School.run(school)
    end
    parsed_response.each do |s|
      school = CleverIntegration::Creators::School.run(s)
      if school
        SchoolsAdmins.find_or_create_by(user_id: user.id, school_id: school.id)
        school
      end
    end
  end

end
