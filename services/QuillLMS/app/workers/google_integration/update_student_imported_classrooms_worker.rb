# frozen_string_literal: true

module GoogleIntegration
  class UpdateStudentImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    class UserNotFoundError < StandardError; end

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      if user.nil?
        ErrorNotifier.report(UserNotFoundError, user_id: user_id)
      else
        StudentImportedClassroomsUpdater.run(user)
      end
    end
  end
end
