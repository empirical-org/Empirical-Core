module CleverIntegration::SignUp::District

  def self.run(auth_hash)
    parsed_data = CleverIntegration::Parsers::DistrictFromAuth.run(auth_hash)
    district = CleverIntegration::Creators::District.run(parsed_data)
    {type: 'district_success', data: district}
  end
end