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

    return unless ENV.fetch('RAILS_ENV', '') == 'production'

    webhook_url = ENV.fetch('SLACK_API_WEBHOOK', '')

    return unless webhook_url.present?

    message = ":rake: rake #{ARGV.join(' ')}"

    sh %(curl -X POST -H 'Content-type: application/json' --data "{'text':'#{message}'}" #{webhook_url})
  end
end
