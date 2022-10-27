# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandler < ApplicationService
      attr_reader :stripe_webhook_event

      delegate :external_id, to: :stripe_webhook_event

      def initialize(stripe_webhook_event)
        @stripe_webhook_event = stripe_webhook_event
      end

      private def stripe_event
        @stripe_event ||= Stripe::Event.retrieve(external_id)
      end
    end
  end
end
