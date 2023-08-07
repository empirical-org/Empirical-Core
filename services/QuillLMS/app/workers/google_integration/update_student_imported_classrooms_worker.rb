# frozen_string_literal: true

module GoogleIntegration
  class UpdateStudentImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      user = ::User.find_by(id: user_id)

      return unless user

      StudentImportedClassroomsUpdater.run(user)
    end
  end
end
