# frozen_string_literal: true

module StudentLearningSequences
  module Backfill
    class RecommendationCompletionWorker < BaseWorker
      def run_backfill
        puts recommendation_activity_sessions.to_sql
        backfill_activity_sessions(recommendation_activity_sessions)
      end

      def recommendation_activity_sessions
        ActivitySession.unscoped.joins(classroom_unit: {
          unit: {
            unit_template: :recommendations
          }
        }).where(classroom_unit: {
          unit: {
            unit_template: {
              recommendations: {
                activity_id: pre_diagnostic_activity_ids
              }
            }
          }
        })
      end
    end
  end
end
