# frozen_string_literal: true

class SyncVitallyOrganizationsWorker
  include Sidekiq::Worker

  def perform(district_ids)
    districts = District.where(id: district_ids)
    payload = districts.map { |district| SerializeVitallySalesOrganization.new(district).data }
    api = VitallyApi.new
    api.batch(payload)
  end
end
