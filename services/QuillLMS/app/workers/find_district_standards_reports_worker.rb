# frozen_string_literal: true

class FindDistrictStandardsReportsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id, is_fremium_view)
    return unless admin_id

    serialized_district_standards_reports_cache_life = 60*60*25
    serialized_district_standards_reports = ProgressReports::DistrictStandardsReports.new(admin_id, is_fremium_view).results.to_json
    if is_fremium_view
      $redis.set("#{SchoolsAdmins::FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports)
      $redis.expire("#{SchoolsAdmins::FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports_cache_life)
    else
      $redis.set("#{SchoolsAdmins::DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports)
      $redis.expire("#{SchoolsAdmins::DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports_cache_life)
      PusherDistrictStandardsReportsCompleted.run(admin_id)
    end
  end
end
