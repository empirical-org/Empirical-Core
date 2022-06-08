# frozen_string_literal: true

class SyncVitallyOrganizationWorker
  include Sidekiq::Worker

  def perform(district_id)
    district = District.find(district_id)
    api = VitallyRestApi.new
    api.create("organizations", district.vitally_data)
  end
end
