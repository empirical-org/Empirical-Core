# frozen_string_literal: true

module SlackTasks
  IGNORED_RAKE_TASKS = %w[
    assets:clean
    assets:precompile
    cron:interval_10_minutes
    cron:interval_1_hour
    cron:interval_1_day
  ]

  def post_slack_rake_task
    return if IGNORED_RAKE_TASKS.include?(ARGV.first)
    return if !should_post_to_slack

    webhook_url = ENV.fetch('SLACK_API_WEBHOOK_DEVELOPER', '')
    return unless webhook_url.present?

    post_to_slack(":rake: rake #{ARGV.join(' ')}", webhook_url)
  end

  def post_sales_form_submission(sales_form_submission)
    return if !should_post_to_slack

    webhook_url = ENV.fetch('SLACK_API_WEBHOOK_SALES', '')
    return unless webhook_url.present?

    sales_form_string = sales_form_submission.attributes.map { |key, value| "#{key}: #{value}\n" }.join
    post_to_slack("Sales Form submitted\n #{sales_form_string}", webhook_url)
  end

  private def post_to_slack(message, webhook_url)
    response = HTTParty.post(
      webhook_url,
      body: {
        text: message,
      }.to_json
    )
  end

  private def should_post_to_slack
    # for testing only
    return true
    return false unless ENV.fetch('RAILS_ENV', '') == 'production'
  end
end
