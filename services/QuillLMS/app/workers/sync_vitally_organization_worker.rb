# frozen_string_literal: true

class SyncVitallyOrganizationWorker
  include Sidekiq::Worker

  class VitallyApiRateLimitException < StandardError; end

  MINIMUM_REQUEUE_WAIT_MINUTES = 2
  MAXIMUM_REQUEUE_WAIT_MINUTES = 20

  def perform(district_id)
    district = District.find(district_id)
    api = VitallyRestApi.new
    response = api.create("organizations", district.vitally_data)

    return unless request_rate_limited?(response)

    requeue_after_rate_limit(district_id)
  end

  private def request_rate_limited?(response)
    response.code == 429
  end

  private def requeue_after_rate_limit(district_id)
    ErrorNotifier.report(VitallyApiRateLimitException.new("Hit the Vitally REST API rate limit trying to sync District ##{district_id}.  Automatically enqueueing to retry."))
    delay = rand(MINIMUM_REQUEUE_WAIT_MINUTES..MAXIMUM_REQUEUE_WAIT_MINUTES)
    SyncVitallyOrganizationWorker.perform_in(delay.minutes, district_id)
  end
end
