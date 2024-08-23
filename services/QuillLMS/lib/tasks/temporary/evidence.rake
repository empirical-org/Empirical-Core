# frozen_string_literal: true

namespace :evidence do
  task backfill_new_question_score_methodology: :environment do
    ActivitySession
      .joins(:activity)
      .where(activity: { classification: ActivityClassification.evidence })
      .where(completed_at: ..DateTime.new(2023, 11, 15))
      .find_each do |concept_result|
      EvidenceUpdateScoringWorker.perform_async(concept_result.activity_session_id)
    end
  end
end
