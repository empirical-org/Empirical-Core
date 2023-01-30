# frozen_string_literal: true

class InternalTool::EmailFeedbackHistorySessionDataWorker
  include Sidekiq::Worker

  def perform(activity_id, start_date, end_date, filter_type, responses_for_scoring, email)
    feedback_histories = FeedbackHistory.session_data_for_csv({activity_id: activity_id, start_date: start_date, end_date: end_date, filter_type: filter_type, responses_for_scoring: responses_for_scoring})
    results = []
    feedback_histories.find_each(batch_size: 10_000) { |feedback_history| results << feedback_history.serialize_csv_data }
    results.sort! { |a,b| b["datetime"] <=> a["datetime"] }
    return if !results

    UserMailer.feedback_history_session_csv_download(email, results).deliver_now!
  end
end
