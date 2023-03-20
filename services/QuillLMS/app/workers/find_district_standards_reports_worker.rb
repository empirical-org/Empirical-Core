# frozen_string_literal: true

class FindDistrictStandardsReportsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL, retry: 2

  def perform(admin_id, is_freemium)
    return unless admin_id

    serialized_district_standards_reports_cache_life = 60*60*25
    serialized_district_standards_reports = ProgressReports::DistrictStandardsReports.new(admin_id, is_freemium).results.to_json
    if is_freemium
      Rails.cache.write("#{SchoolsAdmins::FREEMIUM_DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports, expires_in: serialized_district_standards_reports_cache_life)
    else
      Rails.cache.write("#{SchoolsAdmins::DISTRICT_STANDARD_REPORTS_CACHE_KEY_STEM}#{admin_id}", serialized_district_standards_reports, expires_in: serialized_district_standards_reports_cache_life)
      PusherDistrictStandardsReportsCompleted.run(admin_id)
    end
  end
end
