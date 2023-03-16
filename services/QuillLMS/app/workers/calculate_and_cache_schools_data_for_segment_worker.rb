# frozen_string_literal: true

class CalculateAndCacheSchoolsDataForSegmentWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT

  def perform
    schools = School.joins(:schools_users).where.not(name: School::ALTERNATIVE_SCHOOL_NAMES) # no point caching schools that do not have users
    schools.each do |s|
      CalculateAndCacheSchoolDataForSegmentWorker.perform_async(s.id)
    end
  end
end
