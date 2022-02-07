# frozen_string_literal: true

class FindDistrictStandardsReportsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    return unless admin_id

    serialized_district_standards_reports_cache_life = 60*60*25
    serialized_district_standards_reports = ProgressReports::DistrictStandardsReports.new(admin_id).results.to_json
    $redis.set("SERIALIZED_DISTRICT_STANDARDS_REPORTS_FOR_#{admin_id}", serialized_district_standards_reports)
    $redis.expire("SERIALIZED_DISTRICT_STANDARDS_REPORTS_FOR_#{admin_id}", serialized_district_standards_reports_cache_life)
    PusherDistrictStandardsReportsCompleted.run(admin_id)
  end
end
