# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class EventNotificationHandler < EventHandler
      def run
        send_notification
        stripe_webhook_event.processed!
      rescue => e
        stripe_webhook_event.log_error(e)
      end

      private def send_notification
        StripeIntegration::Mailer.send(self.class::MAILER_ACTION, external_id).deliver_now!
      end
    end
  end
end
