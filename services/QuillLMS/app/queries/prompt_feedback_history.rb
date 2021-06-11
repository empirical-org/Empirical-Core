class PromptFeedbackHistory

    def self.run(activity_id)
        #promptwise_postprocessing promptwise_sessions(activity_id)
        serialize_results prompt_health_query(activity_id)
    end

    def self.prompt_health_query(activity_id)
        FeedbackHistory.select(<<~SELECT
          prompt_id,
          COUNT(DISTINCT feedback_histories.id) AS total_responses,
          COUNT(DISTINCT feedback_histories.feedback_session_uid) AS session_count,
          comprehension_prompts.text AS display_name,
          COUNT(DISTINCT CASE WHEN optimal = true THEN feedback_histories.feedback_session_uid END) AS num_final_attempt_optimal,
          COUNT(DISTINCT CASE WHEN attempt = 5 AND optimal = false THEN feedback_histories.feedback_session_uid END) AS num_final_attempt_not_optimal,
          1.0 * SUM(CASE WHEN optimal = true THEN feedback_histories.attempt END) / COUNT(DISTINCT CASE WHEN optimal = true THEN feedback_histories.feedback_session_uid END) AS avg_attempts_to_optimal,
          COUNT(DISTINCT CASE WHEN flag = 'repeated-consecutive' THEN feedback_histories.feedback_session_uid END) AS num_sessions_consecutive_repeated,
          COUNT(DISTINCT CASE WHEN flag = 'repeated-non-consecutive' THEN feedback_histories.feedback_session_uid END) AS num_sessions_non_consecutive_repeated,
          COUNT(DISTINCT CASE WHEN attempt = 1 AND optimal = true THEN feedback_histories.feedback_session_uid END) AS num_first_attempt_optimal,
          COUNT(DISTINCT CASE WHEN attempt = 1 AND optimal = false THEN feedback_histories.feedback_session_uid END) AS num_first_attempt_not_optimal
        SELECT
        )
        .joins('JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id')
        .joins('LEFT JOIN feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id')
        .where(used: true)
        .where('comprehension_prompts.activity_id = ?', activity_id)
        .group('feedback_histories.prompt_id, comprehension_prompts.text')
    end

    def self.serialize_results(results)
      serialized_rows = results.map do |result|
        payload = result.serializable_hash(
          only: [:prompt_id, :total_responses, :session_count, :display_name, :num_final_attempt_optimal, :num_final_attempt_not_optimal, :avg_attempts_to_optimal, :num_first_attempt_optimal, :num_first_attempt_not_optimal],
          include: []
        )
        payload['num_sessions_with_consecutive_repeated_rule'] = result.num_sessions_consecutive_repeated
        payload['num_sessions_with_non_consecutive_repeated_rule'] = result.num_sessions_non_consecutive_repeated
        payload['avg_attempts_to_optimal'] = payload['avg_attempts_to_optimal']&.round(2) || 0
        payload
      end
      serialized_rows.map{ |row| [row['prompt_id'], row] }.to_h
    end
end
