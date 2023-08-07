# frozen_string_literal: true

class FindDistrictConceptReportsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL, retry: 2

  SERIALIZED_DISTRICT_CONCEPT_REPORTS_CACHE_LIFE = 25.hours.to_i

  def perform(admin_id)
    return unless admin_id

    serialized_district_concept_reports = ProgressReports::DistrictConceptReports.new(admin_id).results.to_json
    Rails.cache.write(
      "#{SchoolsAdmins::DISTRICT_CONCEPT_REPORTS_CACHE_KEY_STEM}#{admin_id}",
      serialized_district_concept_reports,
      expires_in: SERIALIZED_DISTRICT_CONCEPT_REPORTS_CACHE_LIFE
    )

    PusherDistrictConceptReportsCompleted.run(admin_id)
  end
end
