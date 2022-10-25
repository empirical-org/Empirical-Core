# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class ChargeDisputeClosedHandler < EventHandler
      def run
        send_notification
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def mailer_method
        'charge_dispute_closed'
      end
    end
  end
end
