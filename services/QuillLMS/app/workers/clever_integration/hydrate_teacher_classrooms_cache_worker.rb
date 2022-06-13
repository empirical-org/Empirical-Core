# frozen_string_literal: true

module CleverIntegration
  class HydrateTeacherClassroomsCacheWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(teacher_id)
      return unless clever_id?(teacher_id)

      TeacherClassroomsCacheHydrator.run(teacher_id)
    end

    private def clever_id?(teacher_id)
      teacher_id && ::User.find_by(id: teacher_id)&.clever_id&.present?
    end
  end
end
