# frozen_string_literal: true

module SlackTasks
  LIVE = Rails.env.production?

  def post_sales_form_submission(sales_form_submission)
    return if !should_post_to_slack?

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

  private def should_post_to_slack?
    LIVE
  end
end
