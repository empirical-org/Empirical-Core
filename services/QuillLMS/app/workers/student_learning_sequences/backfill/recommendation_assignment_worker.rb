# frozen_string_literal: true

module StudentLearningSequences
  module Backfill
    class RecommendationAssignmentWorker < BaseWorker
      def run_backfill
        backfill_classroom_units(classroom_units.where(unit: {activities: {id: recommendation_activity_ids}}))
      end
    end
  end
end
