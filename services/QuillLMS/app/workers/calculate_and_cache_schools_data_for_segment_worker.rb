# frozen_string_literal: true

class CalculateAndCacheSchoolsDataForSegmentWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    school_ids = School.joins(:school_admins).where.not(name: School::ALTERNATIVE_SCHOOL_NAMES).pluck(:id).uniq # we only want to cache schools that have admins
    school_ids.each do |id|
      CalculateAndCacheSchoolDataForSegmentWorker.perform_async(id)
    end
  end
end
