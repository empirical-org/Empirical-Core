# frozen_string_literal: true

module CleverIntegration
  class DistrictDataAdapter < ::ApplicationService
    attr_reader :auth_hash

    def initialize(auth_hash)
      @auth_hash = auth_hash
    end

    def run
      {
        clever_id: clever_id,
        name: name,
        token: token
      }
    end

    private def clever_id
      auth_hash.info.district
    end

    private def district_client
      DistrictClient.new(token)
    end

    private def name
      district_client.district_name(clever_id)
    end

    private def token
      auth_hash.credentials.token
    end
  end
end