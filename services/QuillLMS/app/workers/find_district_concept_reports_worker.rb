# frozen_string_literal: true

class FindDistrictConceptReportsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    return unless admin_id

    serialized_district_concept_reports_cache_life = 60*60*25
    serialized_district_concept_reports = ProgressReports::DistrictConceptReports.new(admin_id).results.to_json
    $redis.set("SERIALIZED_DISTRICT_CONCEPT_REPORTS_FOR_#{admin_id}", serialized_district_concept_reports)
    $redis.expire("SERIALIZED_DISTRICT_CONCEPT_REPORTS_FOR_#{admin_id}", serialized_district_concept_reports_cache_life)
    PusherDistrictConceptReportsCompleted.run(admin_id)
  end
end
