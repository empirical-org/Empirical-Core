# frozen_string_literal: true

module GoogleIntegration
  class UpdateTeacherImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      return unless google_authorized?(user_id)

      TeacherClassroomsRetriever.run(user_id)
      TeacherImportedClassroomsUpdater.run(user_id)
    end

    private def google_authorized?(user_id)
      user_id && ::User.find_by(id: user_id)&.google_authorized?
    end
  end
end
