# frozen_string_literal: true

namespace :evidence do
  task backfill_new_question_score_methodology: :environment do
    ActivitySession
      .joins(:activity)
      .where(activity: { classification: ActivityClassification.evidence })
      .where(completed_at: ..DateTime.new(2023, 11, 15))
      .pluck(:id)
      .find_each do |id|
      EvidenceUpdateScoringWorker.perform_async(id)
    end
  end
end
