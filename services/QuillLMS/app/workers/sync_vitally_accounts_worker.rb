class SyncVitallyAccountsWorker
  include Sidekiq::Worker

  def perform(school_ids)
    schools = School.where(id: school_ids)
    payload = schools.map { |school| SerializeVitallySalesAccount.new(school).data }
    api = VitallyApi.new
    api.batch(payload)
  end
end
