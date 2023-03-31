# frozen_string_literal: true

class SendSegmentIdentifyCallForAllAdminsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform
    User.admin.ids { |id| IdentifyWorker.perform_async(id) }
  end
end
