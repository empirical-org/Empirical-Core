# frozen_string_literal: true

module GoogleIntegration
  class UpdateTeacherImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      return if user.nil?
      return unless user.teacher? && user.google_authorized?

      TeacherClassroomsCacheHydrator.run(user)
      TeacherImportedClassroomsUpdater.run(user)
    end
  end
end
