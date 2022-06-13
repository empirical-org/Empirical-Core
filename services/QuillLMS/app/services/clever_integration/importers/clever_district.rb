# frozen_string_literal: true

module CleverIntegration::Importers::CleverDistrict
  def self.run(district_id:)
    oclient = CleverIntegration::OauthClient.new
    district_oauth_token = nil
    district_tokens = oclient.get_district_token(district_id: district_id)
    district_oauth_token = district_tokens[0]["access_token"] if district_tokens
    raise "district_oauth_token cannot be nil" if district_oauth_token.nil?

    client = CleverIntegration::LibraryClient.new(district_oauth_token)
    clever_district_data = client.get_district(district_id: district_id)

    CleverIntegration::Creators::CleverDistrict.run(
      clever_id: district_id,
      name: clever_district_data["name"],
      token: district_oauth_token
    )
  end
end
