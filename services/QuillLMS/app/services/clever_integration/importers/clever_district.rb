module CleverIntegration::Importers::CleverDistrict
  def self.run(district_id:)
    oclient = CleverLibrary::Api::Oauth.new()
    district_oauth_token = nil
    district_tokens = oclient.get_district_token(district_id: district_id)
    if district_tokens
      district_oauth_token = district_tokens[0]["access_token"]
    end
    client = CleverLibrary::Api::Client.new(district_oauth_token)
    clever_district_data = client.get_district(district_id: district_id)
    if district_oauth_token.nil?
      raise "district_oauth_token cannot be nil"
    end
    CleverIntegration::Creators::CleverDistrict.run(clever_id: district_id, name: clever_district_data["name"], token: district_oauth_token)
  end
end
