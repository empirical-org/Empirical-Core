# frozen_string_literal: true

module CleverIntegration
  class OauthClient
    include HTTParty
    base_uri 'https://clever.com'

    def initialize
      @options = { headers: { "Authorization": "Basic #{basic_auth_header}" } }
    end

    def get_district_token(district_id:)
      self
        .class
        .get("/oauth/tokens?owner_type=district&district=#{district_id}", @options)
        .parsed_response["data"]
    end

    private def basic_auth_header
      Base64.strict_encode64("#{Auth::Clever::CLIENT_ID}:#{Auth::Clever::CLIENT_SECRET}")
    end
  end
end
