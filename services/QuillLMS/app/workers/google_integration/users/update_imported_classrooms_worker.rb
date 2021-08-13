module GoogleIntegration
  module Users
    class UpdateImportedClassroomsWorker
      include Sidekiq::Worker
      sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

      def perform(user_id)
        return unless user_id

        ClassroomsRetriever.new(user_id).run
        ImportedClassroomsUpdater.new(user_id).run
      end
    end
  end
end
