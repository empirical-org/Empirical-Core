# frozen_string_literal: true

module StudentLearningSequences
  module Backfill
    class PreDiagnosticCompletionWorker < BaseWorker
      def run_backfill
        backfill_activity_sessions(activity_sessions.where(activity_id: pre_diagnostic_activity_ids))
      end
    end
  end
end
