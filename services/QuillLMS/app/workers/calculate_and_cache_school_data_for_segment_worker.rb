# frozen_string_literal: true

class CalculateAndCacheSchoolDataForSegmentWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(school_id)
    school = School.includes(:users).find(school_id)

    cache = CacheSegmentSchoolData.new(school)
    cache.calculate_and_set_cache
  end
end
