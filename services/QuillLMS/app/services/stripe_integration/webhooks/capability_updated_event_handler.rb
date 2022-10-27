# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CapabilityUpdatedEventHandler < EventNotificationHandler
      MAILER_ACTION = 'capability_updated'
    end
  end
end
