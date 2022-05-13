# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandler < ApplicationService
      attr_reader :stripe_webhook_event

      def self.event_type
        to_s.demodulize.gsub('EventHandler','').underscore.tr('_','.')
      end

      def initialize(stripe_webhook_event)
        @stripe_webhook_event = stripe_webhook_event
      end

      private def stripe_event
        @stripe_event ||= Stripe::Event.retrieve(stripe_webhook_event.external_id)
      end
    end
  end
end
