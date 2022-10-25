# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class ChargeDisputeClosedHandler < EventNotificationHandler
      MAILER_ACTION = 'charge_dispute_closed'
    end
  end
end
