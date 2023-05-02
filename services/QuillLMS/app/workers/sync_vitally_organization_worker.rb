# frozen_string_literal: true

class SyncVitallyOrganizationWorker
  include Sidekiq::Worker

  def perform(district_id)
    district = District.find(district_id)
    api = VitallyRestApi.new

    response = api.create(VitallyRestApi::ENDPOINT_ORGANIZATIONS, SerializeVitallySalesOrganization.new(district).data)

    return if response.success?

    raise VitallyRestApi::RateLimitError if response.code == VitallyRestApi::RATE_LIMIT_CODE

    raise VitallyRestApi::ApiError, response.code.to_s
  end
end
