# frozen_string_literal: true

module CanvasIntegration
  class HydrateTeacherClassroomsCacheWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      return if user.nil?

      TeacherClassroomsCacheHydrator.run(user)
    end
  end
end
