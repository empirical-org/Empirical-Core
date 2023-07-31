# frozen_string_literal: true

class SyncVitallyAccountsWorker
  include Sidekiq::Worker

  def perform(school_ids)
    schools = School.where(id: school_ids)
    payload = schools.map { |school| VitallyIntegration::SerializeVitallySalesAccount.new(school).data }
    api = VitallyIntegration::AnalyticsApi.new
    api.batch(payload)
  end
end
