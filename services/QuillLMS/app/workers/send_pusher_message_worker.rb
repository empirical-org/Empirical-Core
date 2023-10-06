# frozen_string_literal: true

class SendPusherMessageWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(user_id, pusher_event, payload = nil)
    return unless user_id and pusher_event

    PusherTrigger.run(user_id, pusher_event, payload)
  end
end
