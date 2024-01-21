# frozen_string_literal: true

class SendPusherMessageWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::INSTANT

  def perform(user_id, pusher_event, payload = nil)
    return unless user_id && pusher_event

    PusherTrigger.run(user_id, pusher_event, payload)
  end
end
