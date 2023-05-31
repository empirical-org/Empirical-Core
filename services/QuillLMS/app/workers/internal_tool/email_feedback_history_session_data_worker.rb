# frozen_string_literal: true

class InternalTool::EmailFeedbackHistorySessionDataWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  FEEDBACK_HISTORY_CSV_HEADERS = %w{Date/Time SessionID Conjunction Attempt Optimal? Completed? Response Feedback Rule}
  DEFAULT_MAX_ATTEMPTS = 5

  def perform(activity_id, start_date, end_date, filter_type, responses_for_scoring, email)
    feedback_histories = FeedbackHistory.session_data_for_csv(
        activity_id: activity_id,
        start_date: start_date,
        end_date: end_date,
        filter_type: filter_type,
        responses_for_scoring: responses_for_scoring
    )
    results = []
    feedback_histories.find_each(batch_size: 10_000) { |feedback_history| results << feedback_history.serialize_csv_data }
    results.sort! { |a,b| b["datetime"] <=> a["datetime"] }
    return if !results

    csv = CSV.generate(headers: true) do |csv_body|
      csv_body << FEEDBACK_HISTORY_CSV_HEADERS
      results.each do |row|
        csv_body << [
          row["datetime"],
          row["session_uid"],
          row["conjunction"],
          row["attempt"],
          row["optimal"],
          row['optimal'] || row['attempt'] == DEFAULT_MAX_ATTEMPTS,
          row["response"],
          row["feedback"],
          "#{row['feedback_type']}: #{row['name']}"
        ]
      end
    end

    UserMailer.feedback_history_session_csv_download(email, csv).deliver_now!
  end
end
