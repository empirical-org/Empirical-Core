# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class CapabilityUpdatedHandler < EventNotificationHandler
      MAILER_ACTION = 'capability_updated'
    end
  end
end
