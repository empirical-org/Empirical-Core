# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class ChargeDisputeCreatedHandler < EventHandler
      def run
        notify_quill_team
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def notify_quill_team
        StripeIntegration::Mailer.charge_dispute_created
      end
    end
  end
end
