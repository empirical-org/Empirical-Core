# frozen_string_literal: true

module StripeIntegration
  class Mailer < ApplicationMailer
    default from: QUILL_TEAM_EMAIL_ADDRESS

    STRIPE_DASHBOARD_URL = 'https://dashboard.stripe.com'
    STRIPE_BANKING_NOTIFICATIONS_EMAIL = ENV.fetch('STRIPE_BANKING_NOTIFICATIONS_EMAIL', '')
    STRIPE_PAYMENT_NOTIFICATIONS_EMAIL = ENV.fetch('STRIPE_PAYMENT_NOTIFICATIONS_EMAIL', '')

    def account_updated(external_id)
      @dashboard_url = "#{STRIPE_DASHBOARD_URL}/events/#{external_id}"
      mail to: STRIPE_BANKING_NOTIFICATIONS_EMAIL, subject: 'Account Updated'
    end

    def capability_updated(external_id)
      @dashboard_url = "#{STRIPE_DASHBOARD_URL}/events/#{external_id}"
      mail to: STRIPE_BANKING_NOTIFICATIONS_EMAIL, subject: 'Capability Updated'
    end

    def charge_dispute_closed(external_id)
      @external_id = external_id
      @dashboard_url = "#{STRIPE_DASHBOARD_URL}/disputes"
      mail to: STRIPE_PAYMENT_NOTIFICATIONS_EMAIL, subject: 'Charge Dispute Closed'
    end

    def charge_dispute_created(external_id)
      @external_id = external_id
      @dashboard_url = "#{STRIPE_DASHBOARD_URL}/disputes?statuses[0]=needs_response"
      mail to: STRIPE_PAYMENT_NOTIFICATIONS_EMAIL, subject: 'Charge Dispute Created'
    end
  end
end
