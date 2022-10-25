# frozen_string_literal: true

module StripeIntegration
  module Webhooks
    class AccountUpdatedEventHandler < EventNotificationHandler
      MAILER_ACTION = 'account_updated'
    end
  end
end
