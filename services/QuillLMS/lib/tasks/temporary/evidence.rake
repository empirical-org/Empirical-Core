# frozen_string_literal: true

namespace :evidence do
  task backfill_new_question_score_methodology: :environment do
    ActivitySession
      .joins(:activity)
      .where(activity: { classification: ActivityClassification.evidence })
      .where(completed_at: ..DateTime.new(2023, 11, 15))
      .find_each do |activity_session|
      EvidenceUpdateScoringWorker.perform_async(activity_session.id)
    end
  end
end
