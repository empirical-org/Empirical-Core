# frozen_string_literal: true

class FindDistrictActivityScoresWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL

  SERIALIZED_DISTRICT_ACTIVITY_SCORES_CACHE_LIFE = 25.hours.to_i

  def perform(admin_id)
    serialized_district_activity_scores = ProgressReports::DistrictActivityScores.new(admin_id).results.to_json

    Rails.cache.write(
      "#{SchoolsAdmins::DISTRICT_ACTIVITY_SCORES_CACHE_KEY_STEM}#{admin_id}",
      serialized_district_activity_scores,
      expires_in: SERIALIZED_DISTRICT_ACTIVITY_SCORES_CACHE_LIFE
    )

    PusherDistrictActivityScoresCompleted.run(admin_id)
  end
end
