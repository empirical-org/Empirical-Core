module GoogleIntegration
  class UpdateTeacherImportedClassroomsWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

    def perform(user_id)
      return unless google_id?(user_id)

      TeacherClassroomsRetriever.new(user_id).run
      TeacherImportedClassroomsUpdater.new(user_id).run
    end

    private def google_id?(user_id)
      user_id && ::User.find_by(id: user_id)&.google_id&.present?
    end
  end
end
