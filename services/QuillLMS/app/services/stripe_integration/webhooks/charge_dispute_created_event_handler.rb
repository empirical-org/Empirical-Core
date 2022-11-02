# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class ChargeDisputeCreatedEventHandler < EventNotificationHandler
      MAILER_ACTION = 'charge_dispute_created'
    end
  end
end
