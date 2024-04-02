# frozen_string_literal: true

class CalculateAndCacheVitallyAccountWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(school_id, year)
    school = School.find(school_id)
    data = VitallyIntegration::PreviousYearSchoolDatum.new(school, year).calculate_data
    VitallyIntegration::CacheVitallySchoolData.set(school_id, year, data.to_json)
  end
end
