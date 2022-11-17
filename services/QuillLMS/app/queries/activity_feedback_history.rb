# frozen_string_literal: true

class ActivityFeedbackHistory
  def self.run(activity_id:, activity_version: nil)
    activity_stats_query(activity_id: activity_id)
  end

  def self.activity_stats_query(activity_id:, activity_version: nil)

    inner_query = ActivitySession.unscoped
      .joins("INNER JOIN feedback_sessions ON feedback_sessions.activity_session_uid = activity_sessions.uid")
      .joins(:feedback_histories)
      .joins("LEFT JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id")
      .where("comprehension_prompts.activity_id = ?", activity_id)

    inner_query = inner_query.where("feedback_histories.activity_version = ?", activity_version) if activity_version
    inner_query = inner_query.select("activity_sessions.timespent AS timespent", "feedback_sessions.uid AS feedback_session_uid", "activity_sessions.state AS state").to_sql

    activity_sessions_agg = ActivitySession.unscoped
      .select("AVG(timespent) AS average_time_spent", "CAST(COUNT(DISTINCT CASE WHEN state = 'finished' THEN feedback_session_uid END) AS FLOAT) / NULLIF(CAST(COUNT(DISTINCT feedback_session_uid) AS FLOAT), 0) AS average_completion_rate")
      .from("(#{inner_query}) as inner_query")
      .to_a

    return { average_time_spent: 0, average_completion_rate: 0 } if activity_sessions_agg.empty?

    average_time_spent = activity_sessions_agg[0]['average_time_spent']
    average_completion_rate = activity_sessions_agg[0]['average_completion_rate']

    {
      average_time_spent: average_time_spent ? Utils::Numeric.seconds_to_human_readable_time((activity_sessions_agg[0]['average_time_spent'].to_f)) : 0,
      average_completion_rate: average_completion_rate ? (average_completion_rate.to_f * 100).round(2) : 0
    }
  end
end
