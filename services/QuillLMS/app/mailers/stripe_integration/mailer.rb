# frozen_string_literal: true

module StripeIntegration
  class Mailer < ::ApplicationMailer
    default from: QUILL_TEAM_EMAIL_ADDRESS

    STRIPE_DASHBOARD_URL = 'https://dashboard.stripe.com'
    STRIPE_NOTIFICATIONS_EMAIL = ENV.fetch('STRIPE_NOTIFICATIONS_EMAIL', '')
    CHARGE_DISPUTE_CREATED_URL = "#{STRIPE_DASHBOARD_URL}/disputes?statuses[0]=needs_response"

    def charge_dispute_created
      mail(to: STRIPE_NOTIFICATIONS_EMAIL, subject: 'Charge Dispute Created') do |format|
        format.text do
          render plain: "A response is needed on a disupted stripe subscription charge: #{CHARGE_DISPUTE_CREATED_URL}"
        end
      end
    end
  end
end
