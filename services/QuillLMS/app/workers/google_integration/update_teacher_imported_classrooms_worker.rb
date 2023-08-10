# frozen_string_literal: true

module GoogleIntegration
  class UpdateTeacherImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    class UserNotFoundError < StandardError; end

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      return ErrorNotifier.report(UserNotFoundError, user_id: user_id) if user.nil?
      return unless user.google_authorized?

      TeacherClassroomsCacheHydrator.run(user)
      TeacherImportedClassroomsUpdater.run(user)
    end
  end
end
