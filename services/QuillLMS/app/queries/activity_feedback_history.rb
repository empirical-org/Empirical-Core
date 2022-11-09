# frozen_string_literal: true

class ActivityFeedbackHistory
  def self.run(activity_id:)
    activity_stats_query(activity_id: activity_id)
  end

  def self.activity_stats_query(activity_id:)
    activity_sessions_agg = RawSqlRunner.execute(
      <<-SQL
        SELECT
        AVG(timespent) AS average_time_spent,
        CAST(COUNT(DISTINCT CASE WHEN state = 'finished' THEN feedback_session_uid END) AS FLOAT) / NULLIF(CAST(COUNT(DISTINCT feedback_session_uid) AS FLOAT), 0) AS average_completion_rate
        FROM
        (
          SELECT activity_sessions.timespent AS timespent, feedback_sessions.uid AS feedback_session_uid, activity_sessions.state AS state
          FROM
          activity_sessions
          INNER JOIN feedback_sessions ON feedback_sessions.activity_session_uid = activity_sessions.uid
          LEFT JOIN feedback_histories ON feedback_sessions.uid = feedback_histories.feedback_session_uid
          LEFT JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id
          WHERE comprehension_prompts.activity_id = #{activity_id}
        ) inner_query
      SQL
    ).to_a

    return { average_time_spent: 0, average_completion_rate: 0 } if activity_sessions_agg.empty?

    average_time_spent = activity_sessions_agg[0]['average_time_spent']
    average_completion_rate = activity_sessions_agg[0]['average_completion_rate']

    {
      average_time_spent: average_time_spent ? Utils::Numeric.seconds_to_human_readable_time((activity_sessions_agg[0]['average_time_spent'].to_f)) : 0,
      average_completion_rate: average_completion_rate ? (average_completion_rate.to_f * 100).round(2) : 0
    }
  end
end
