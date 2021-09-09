class RetrieveGoogleClassroomsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(user_id)
    return unless user_id

    GoogleIntegration::Users::ClassroomsRetriever.new(user_id).run
  end
end
