# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class NilEventHandler < EventHandler
      class UnhandledEventError < StandardError; end

      def run
        stripe_webhook_event.log_error(UnhandledEventError.new)
      end
    end
  end
end
