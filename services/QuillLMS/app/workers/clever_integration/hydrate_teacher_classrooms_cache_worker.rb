# frozen_string_literal: true

module CleverIntegration
  class HydrateTeacherClassroomsCacheWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      return if user.nil?
      return unless user.teacher? && user.clever_authorized?

      TeacherClassroomsCacheHydrator.run(user)
    end
  end
end
