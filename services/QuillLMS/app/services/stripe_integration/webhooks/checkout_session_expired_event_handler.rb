# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CheckoutSessionExpiredEventHandler < EventHandler
      def run
        stripe_checkout_session&.destroy!
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def stripe_checkout_session
        StripeCheckoutSession.find_by(external_checkout_session_id: external_checkout_session_id)
      end

      private def external_checkout_session_id
        stripe_event.data.object.id
      end
    end
  end
end
