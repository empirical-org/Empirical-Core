# frozen_string_literal: true

module SendgridIntegration
  class MonthlyEmailCapWarningWorker
    include Sidekiq::Worker

    AGGREGATED_BY = 'month'

    def perform
      return unless threshold_exceeded?

      Mailer
        .monthly_email_cap_warning(num_emails_sent)
        .deliver_now!
    end


    private def end_date
      Date.current.end_of_month.to_s
    end

    private def query_params
      {
        aggregated_by: AGGREGATED_BY,
        limit: 1,
        start_date: start_date,
        end_date: end_date,
        offset: 1
      }
    end

    private def num_emails_sent
      results&.first&.[]('stats')&.first&.dig('metrics', 'delivered')
    end

    private def sendgrid_api
      SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    end

    private def start_date
      Date.current.beginning_of_month.to_s
    end

    private def stats
      @stats ||= JSON.parse(stats_response.body)
    end

    private def stats_response
      sendgrid_api
        .client
        .stats
        .get(query_params: query_params)
    end

    private def threshold_exceeded?
      num_emails_sent >= Mailer::SENDGRID_MONTHLY_EMAIL_CAP * Mailer::SENDGRID_THRESHOLD_PERCENT / 100.0
    end
  end
end

