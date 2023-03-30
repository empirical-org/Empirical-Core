# frozen_string_literal: true

class SendSegmentIdentifyCallForAllAdminsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    user_ids = User.where(role: User::ADMIN).ids
    user_ids.each do |id|
      IdentifyWorker.perform_async(id)
    end
  end
end
