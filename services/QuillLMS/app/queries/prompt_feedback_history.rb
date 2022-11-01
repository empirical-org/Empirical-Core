# frozen_string_literal: true

class PromptFeedbackHistory
  def self.run(activity_id:, start_date: nil, end_date: nil)
    serialize_results prompt_health_query(activity_id: activity_id, start_date: start_date, end_date: end_date)
  end

  def self.prompt_health_query(activity_id:, start_date: nil, end_date: nil)
    query = FeedbackHistory.select(<<~SELECT
      prompt_id,
      COUNT(DISTINCT feedback_histories.id) AS total_responses,
      COUNT(DISTINCT feedback_histories.feedback_session_uid) AS session_count,
      comprehension_prompts.text AS display_name,
      COUNT(DISTINCT CASE WHEN optimal = true THEN feedback_histories.feedback_session_uid END) AS num_final_attempt_optimal,
      COUNT(DISTINCT CASE WHEN attempt = 5 AND optimal = false THEN feedback_histories.feedback_session_uid END) AS num_final_attempt_not_optimal,
      1.0 * COUNT(feedback_histories.attempt) / COUNT(DISTINCT feedback_histories.feedback_session_uid) AS avg_attempts,
      COUNT(DISTINCT CASE WHEN flag = 'repeated-consecutive' THEN feedback_histories.feedback_session_uid END) AS num_sessions_consecutive_repeated,
      COUNT(DISTINCT CASE WHEN flag = 'repeated-non-consecutive' THEN feedback_histories.feedback_session_uid END) AS num_sessions_non_consecutive_repeated,
      COUNT(DISTINCT CASE WHEN attempt = 1 AND optimal = true THEN feedback_histories.feedback_session_uid END) AS num_first_attempt_optimal,
      COUNT(DISTINCT CASE WHEN attempt = 1 AND optimal = false THEN feedback_histories.feedback_session_uid END) AS num_first_attempt_not_optimal,
      AVG(CAST(CASE
        WHEN comprehension_prompts.conjunction = 'because' THEN (data->>'time_tracking')::json->>'because'
        WHEN comprehension_prompts.conjunction = 'but' THEN (data->>'time_tracking')::json->>'but'
        WHEN comprehension_prompts.conjunction = 'so' THEN (data->>'time_tracking')::json->>'so'
        ELSE '0'
      END AS int)) AS avg_time_spent,
      AVG(CAST((feedback_histories.metadata->>'api')::json->>'confidence' AS float)) AS avg_confidence
    SELECT
    )
      .joins('JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
      .joins('LEFT JOIN feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id')
      .joins('LEFT JOIN feedback_sessions ON feedback_histories.feedback_session_uid = feedback_sessions.uid')
      .joins('LEFT JOIN activity_sessions ON feedback_sessions.activity_session_uid = activity_sessions.uid')
      .where(used: true)
      .where('comprehension_prompts.activity_id = ?', activity_id)
      .group('feedback_histories.prompt_id, comprehension_prompts.text')
    query = query.where("feedback_histories.created_at >= ?", start_date) if start_date
    query = query.where("feedback_histories.created_at <= ?", end_date) if end_date
    query
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.serialize_results(results)
    serialized_rows = results.map do |result|
      payload = result.serializable_hash(
        only: [:prompt_id, :total_responses, :session_count, :display_name, :num_final_attempt_optimal, :num_final_attempt_not_optimal, :avg_attempts, :num_first_attempt_optimal, :num_first_attempt_not_optimal, :avg_time_spent, :avg_confidence],
        include: []
      )
      payload['num_sessions_with_consecutive_repeated_rule'] = result.num_sessions_consecutive_repeated
      payload['num_sessions_with_non_consecutive_repeated_rule'] = result.num_sessions_non_consecutive_repeated
      payload['avg_attempts'] = payload['avg_attempts']&.round(2)&.to_f || 0
      payload['avg_confidence'] = payload['avg_confidence'] ? payload['avg_confidence'].round(2) * 100 : 0
      payload['avg_time_spent'] = payload['avg_time_spent'] ? Utils::Numeric.seconds_to_human_readable_time(payload['avg_time_spent']) : 0
      payload
    end
    serialized_rows.map{ |row| [row['prompt_id'], row] }.to_h
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
