# frozen_string_literal: true

module VitallyIntegration
  class UnignoreOrganization < ApplicationService
    attr_reader :api, :district_id

    def initialize(district_id)
      @district_id = district_id
    end

    def run
      # We use a create call here with externalId because update calls require the proprietary Vitally ID which we don't store,
      # but Vitally makes an update call on the backend when creating with an externalId that's already used for a record.
      api.create(
        RestApi::ENDPOINT_ORGANIZATIONS,
        payload
      )
    end

    private def api = @api ||= RestApi.new
    private def district = @district ||= District.find(district_id)
    private def external_id = district.id.to_s
    private def name = district.name

    private def payload
      {
        externalId: external_id,
        name:,
        traits: {
          unignore_org: true
        }
      }
    end
  end
end
