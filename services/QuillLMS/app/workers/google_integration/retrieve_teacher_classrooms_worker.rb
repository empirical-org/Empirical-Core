# frozen_string_literal: true

module GoogleIntegration
  class RetrieveTeacherClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(teacher_id)
      return unless google_id?(teacher_id)

      TeacherClassroomsRetriever.run(teacher_id)
    end

    private def google_id?(teacher_id)
      teacher_id && ::User.find_by(id: teacher_id)&.google_id&.present?
    end
  end
end
