# frozen_string_literal: true

module CleverIntegration
  class OauthClient
    include HTTParty
    base_uri 'https://clever.com'

    def initialize
      @options = {
        headers: {
          "Authorization": "Basic #{Base64.strict_encode64("#{Clever.const_get(:CLIENT_ID)}:#{Clever.const_get(:CLIENT_SECRET)}")}"
        }
      }
    end

    def get_district_token(district_id:)
      self.class.get("/oauth/tokens?owner_type=district&district=#{district_id}", @options).parsed_response["data"]
    end
  end
end
