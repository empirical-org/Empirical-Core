# frozen_string_literal: true

module SendgridIntegration
  class Mailer < ApplicationMailer
    default from: QUILL_TEAM_EMAIL_ADDRESS

    SENDGRID_STATS_EMAIL = ENV.fetch('SENDGRID_STATS_EMAIL', '')
    SENDGRID_MONTHLY_EMAIL_CAP = 100_000
    SENDGRID_THRESHOLD_PERCENT = ENV.fetch('SENDGRID_THRESHOLD_PERCENT', 90)

    def monthly_email_cap_warning(emails_sent)
      @emails_sent = emails_sent
      @monthly_cap = SENDGRID_MONTHLY_EMAIL_CAP
      @percent_used = (100.0 * @emails_sent / @monthly_cap).round(2).to_i
      mail to: SENDGRID_STATS_EMAIL, subject: "Warning: Monthly Email Cap at #{@percent_used}%"
    end
  end
end
