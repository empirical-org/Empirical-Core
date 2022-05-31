# frozen_string_literal: true

class SyncVitallyOrganizationWorker
  include Sidekiq::Worker

  def perform(district_id)
    district = District.find(district_id)
    payload = district.vitally_data
    api = VitallyRestApi.new
    api.create("organizations", payload)
  end
end
