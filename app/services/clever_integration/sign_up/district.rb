module CleverIntegration::SignUp::District

  def self.run(auth_hash)
    parsed_data = CleverIntegration::Parsers::District.run(auth_hash)
    district = CleverIntegration::Creators.District.run(parsed_data)
    district
  end
end