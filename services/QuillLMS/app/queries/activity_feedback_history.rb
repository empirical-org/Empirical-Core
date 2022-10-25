# frozen_string_literal: true

class ActivityFeedbackHistory
  def self.run(activity_id:)
    serialize_results activity_stats_query(activity_id: activity_id)
  end

  def self.activity_stats_query(activity_id:)
    query = FeedbackHistory.select(<<~SELECT
      AVG(timespent) AS average_time_spent,
      CAST(COUNT(DISTINCT CASE WHEN state = 'finished' THEN feedback_session_uid END) AS DECIMAL) / COUNT(feedback_session_uid) AS average_completion_rate
      FROM
      (SELECT
      DISTINCT timespent, feedback_session_uid, state
      from activity_sessions
      INNER JOIN feedback_sessions ON feedback_sessions.activity_session_uid = activity_sessions.uid
      LEFT JOIN feedback_histories ON feedback_sessions.uid = feedback_histories.feedback_session_uid
      LEFT JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id
      WHERE comprehension_prompts.activity_id = 87
      ) distinct_session_data
    SELECT
    )
    query
  end

  def self.serialize_results(results)
    serialized_rows = results.map do |result|
      payload = result.serializable_hash(
        only: [:prompt_id, :total_responses, :session_count, :display_name, :num_final_attempt_optimal, :num_final_attempt_not_optimal, :avg_attempts, :num_first_attempt_optimal, :num_first_attempt_not_optimal, :time_spent],
        include: []
      )
      payload['num_sessions_with_consecutive_repeated_rule'] = result.num_sessions_consecutive_repeated
      payload['num_sessions_with_non_consecutive_repeated_rule'] = result.num_sessions_non_consecutive_repeated
      payload['avg_attempts'] = payload['avg_attempts']&.round(2)&.to_f || 0
      payload
    end
    serialized_rows.map{ |row| [row['prompt_id'], row] }.to_h
  end
end
