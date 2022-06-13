# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class HandleEventWorker
      include Sidekiq::Worker
      sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

      def perform(stripe_webhook_event_id)
        stripe_webhook_event = StripeWebhookEvent.find_by(id: stripe_webhook_event_id)

        return if stripe_webhook_event.nil?

        EventHandlerFactory.for(stripe_webhook_event).run
      end
    end
  end
end

