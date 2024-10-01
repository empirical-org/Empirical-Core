# frozen_string_literal: true

module StudentLearningSequences
  module Backfill
    class RecommendationAssignmentWorker < BaseWorker
      def run_backfill
        backfill_classroom_units(recommendation_classroom_units)
      end

      def recommendation_classroom_units
        ClassroomUnit.joins(unit: {unit_template: :recommendations})
          .where(unit: {
            unit_template: {
              recommendations: {
                activity_id: pre_diagnostic_activity_ids
              }
            }
          }
        )
      end
    end
  end
end
