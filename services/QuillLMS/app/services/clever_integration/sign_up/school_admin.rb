# frozen_string_literal: true

module CleverIntegration::SignUp::SchoolAdmin

  def self.run(auth_hash)
    parsed_data = parse_data(auth_hash)

    district = import_district(parsed_data[:district_id])
    district_integration(parsed_data, district)
  end

  def self.district_integration(parsed_data, district)
    user = create_user(parsed_data)
    if user.present?
      associate_user_to_district(user, district)
      import_schools(user, district.token)
      {type: 'user_success', data: user}
    else
      {type: 'user_failure', data: "No User Present"}
    end
  end

  def self.parse_data(auth_hash)
    CleverIntegration::Parsers::SchoolAdminFromAuth.run(auth_hash)
  end

  def self.create_user(parsed_data)
    CleverIntegration::Creators::Teacher.run(parsed_data)
  end

  def self.associate_user_to_district(user, district)
    CleverIntegration::Associators::TeacherToDistrict.run(user, district)
  end

  def self.import_district(district_id)
    CleverIntegration::Importers::CleverDistrict.run(district_id: district_id)
  end

  def self.import_schools(user, district_token)
    CleverIntegration::Importers::SchoolAdminSchools.run(user, district_token)
  end

end
