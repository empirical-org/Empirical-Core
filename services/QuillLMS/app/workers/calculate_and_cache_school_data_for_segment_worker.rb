# frozen_string_literal: true

class CalculateAndCacheSchoolDataForSegmentWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform(school_id)
    school = School.find(school_id)

    cache = CacheSegmentSchoolData.new(school)
    cache.set_all_fields
  end
end
