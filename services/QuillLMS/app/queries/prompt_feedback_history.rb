class PromptFeedbackHistory

    def self.run(activity_id)
        promptwise_postprocessing promptwise_sessions(activity_id)
    end

    def self.promptwise_sessions(activity_id)
        activity_sessions = ActivitySession.where(activity_id: activity_id).includes(:feedback_sessions)
        feedback_session_uids = activity_sessions.reduce([]) {|memo, a_s| memo.concat a_s.feedback_sessions.pluck(:uid)}

        sql = <<~SQL 
          SELECT prompt_id, feedback_session_uid, count(*) as session_count, bool_or(optimal) as at_least_one_optimal, MAX(attempt) as attempt_cardinal
          FROM feedback_histories
          WHERE feedback_session_uid IN (#{feedback_session_uids.map{|e| "'#{e}'"}.join(',')})
          GROUP BY prompt_id, feedback_session_uid
        SQL
        FeedbackHistory.find_by_sql(sql)
    end

    def self.promptwise_postprocessing(grouped_feedback_histories)
        prompt_hash = {}

        prompts = Comprehension::Prompt.where(id: grouped_feedback_histories.map(&:prompt_id))
   
        grouped_feedback_histories.each do |prompt_session|
            prompt_id = prompt_session.prompt_id

            prompt_hash[prompt_id] ||= {
                optimal_final_attempts: 0, 
                session_count: 0, 
                total_responses: 0,
                final_attempt_pct_optimal: 0,
                final_attempt_pct_not_optimal: 0,
                display_name: ''
            }

            prompt_hash[prompt_id][:display_name] = prompts.find(prompt_id).text

            if prompt_session.at_least_one_optimal
              prompt_hash[prompt_id][:optimal_final_attempts] += 1
            end

            prompt_hash[prompt_id][:total_responses] += prompt_session.session_count
            prompt_hash[prompt_id][:session_count] += 1

            prompt_hash[prompt_id][:final_attempt_pct_optimal] = \
              prompt_hash[prompt_id][:optimal_final_attempts] / prompt_hash[prompt_id][:session_count].to_f      

            prompt_hash[prompt_id][:final_attempt_pct_not_optimal] = \
              (prompt_hash[prompt_id][:session_count] - prompt_hash[prompt_id][:optimal_final_attempts]) / prompt_hash[prompt_id][:session_count].to_f 
        end
        prompt_hash
    end
end