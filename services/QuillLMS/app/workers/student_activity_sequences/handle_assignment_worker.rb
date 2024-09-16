# frozen_string_literal: true

module StudentActivitySequences
  class HandleAssignmentWorker
    include Sidekiq::Worker

    def perform(classroom_unit_id, student_id, backfill = false)
      HandleAssignment.run(classroom_unit_id, student_id, backfill)
    end
  end
end
