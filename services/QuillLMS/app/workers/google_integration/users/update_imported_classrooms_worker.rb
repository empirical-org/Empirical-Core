module GoogleIntegration
  module Users
    class UpdateImportedClassroomsWorker
      include Sidekiq::Worker
      sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

      def perform(user_id)
        return unless google_id?(user_id)

        ClassroomsRetriever.new(user_id).run
        ImportedClassroomsUpdater.new(user_id).run
      end

      private def google_id?(user_id)
        user_id && ::User.find_by(id: user_id)&.google_id&.present?
      end
    end
  end
end
