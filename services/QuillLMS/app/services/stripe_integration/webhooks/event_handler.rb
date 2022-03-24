# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventHandler < ApplicationService
      attr_reader :stripe_webhook_event

      def initialize(stripe_webhook_event)
        @stripe_webhook_event = stripe_webhook_event
      end
    end
  end
end
