# frozen_string_literal: true

class FindDistrictActivityScoresWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(admin_id)
    serialized_district_activity_scores_cache_life = 60*60*25
    serialized_district_activity_scores = ProgressReports::DistrictActivityScores.new(admin_id).results.to_json
    $redis.set("#{SchoolsAdmins::DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{admin_id}", serialized_district_activity_scores)
    $redis.expire("#{SchoolsAdmins::DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{admin_id}", serialized_district_activity_scores_cache_life)
    PusherDistrictActivityScoresCompleted.run(admin_id)
  end
end
