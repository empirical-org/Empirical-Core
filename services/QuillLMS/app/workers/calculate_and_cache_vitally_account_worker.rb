class CalculateAndCacheVitallyAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(school_id, year)
    school = School.find(school_id)
    data = PreviousYearSchoolDatum.new(school, year).calculate_data
    CacheVitallySchoolData.set(school_id, year, data.to_json)
  end
end
