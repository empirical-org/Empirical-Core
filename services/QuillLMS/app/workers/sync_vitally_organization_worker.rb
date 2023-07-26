# frozen_string_literal: true

class SyncVitallyOrganizationWorker
  include Sidekiq::Worker

  def perform(district_id)
    district = District.find(district_id)
    api = VitallyIntegration::RestApi.new

    response = api.create(
      VitallyIntegration::RestApi::ENDPOINT_ORGANIZATIONS,
      VitallyIntegration::SerializeVitallySalesOrganization.new(district).data
    )

    return if response.success?

    raise VitallyIntegration::RestApi::RateLimitError if response.code == VitallyIntegration::RestApi::RATE_LIMIT_CODE

    raise VitallyIntegration::RestApi::ApiError, response.code.to_s
  end
end
