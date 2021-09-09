class SyncVitallyPastYearAccountsWorker
  include Sidekiq::Worker

  def perform(school_ids, year)
    schools = School.where(id: school_ids)
    schools.each do |school|
      CalculateAndCacheVitallyAccountWorker.perform_async(school.id, year)
    end
  end
end
