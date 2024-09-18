# frozen_string_literal: true

module StudentLearningSequences
  class HandleAssignmentWorker
    include Sidekiq::Worker

    def perform(classroom_unit_id, student_id)
      HandleAssignment.run(classroom_unit_id, student_id)
    end
  end
end
