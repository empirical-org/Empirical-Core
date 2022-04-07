# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class UnknownEventHandler < EventHandler
      class UnknownEventError < StandardError; end

      def run
        stripe_webhook_event.failed!
        stripe_webhook_event.log_error(UnknownEventError.new)
      end
    end
  end
end
