class PromptFeedbackHistory

    def self.run(activity_id)
        promptwise_postprocessing promptwise_sessions(activity_id)
    end

    def self.promptwise_sessions(activity_id)
        sql = <<~SQL 
          SELECT prompt_id, feedback_session_uid, count(*) as session_count, bool_or(optimal) as at_least_one_optimal, MAX(attempt) as attempt_cardinal
          FROM feedback_histories
          JOIN comprehension_prompts
            ON feedback_histories.prompt_id = comprehension_prompts.id
          WHERE comprehension_prompts.activity_id = ?
          GROUP BY prompt_id, feedback_session_uid
        SQL
        FeedbackHistory.find_by_sql([sql, activity_id])
    end

    def self.promptwise_postprocessing(grouped_feedback_histories)
        prompt_hash = {}

        prompts = Comprehension::Prompt.where(id: grouped_feedback_histories.map(&:prompt_id))
   
        grouped_feedback_histories.each do |prompt_session|
            prompt_id = prompt_session.prompt_id

            prompt_hash[prompt_id] ||= {
                optimal_final_attempts: 0.0, 
                total_responses: 0.0,
                session_count: 0.0, 
                final_attempt_pct_optimal: 0.0,
                final_attempt_pct_not_optimal: 0.0,
                avg_attempts_to_optimal: 0.0,
                optimal_attempt_array: [],
                display_name: ''
            }

            prompt_hash[prompt_id][:display_name] = prompts.find(prompt_id).text

            if prompt_session.at_least_one_optimal
              prompt_hash[prompt_id][:optimal_final_attempts] += 1
              prompt_hash[prompt_id][:optimal_attempt_array].append prompt_session.attempt_cardinal
            end

            prompt_hash[prompt_id][:total_responses] += prompt_session.session_count
            prompt_hash[prompt_id][:session_count] += 1
        end
        apply_summations(prompt_hash)
    end

    def self.apply_summations(prompt_hash)
      prompt_hash.each do |k,v|
        if v[:optimal_final_attempts] == 0
          prompt_hash[k][:avg_attempts_to_optimal] = 0.0
        else 
          prompt_hash[k][:avg_attempts_to_optimal] = v[:optimal_attempt_array].sum / v[:optimal_final_attempts].to_f
        end

        prompt_hash[k][:final_attempt_pct_optimal] = \
          prompt_hash[k][:optimal_final_attempts] / prompt_hash[k][:session_count].to_f      

        prompt_hash[k][:final_attempt_pct_not_optimal] = \
          (prompt_hash[k][:session_count] - prompt_hash[k][:optimal_final_attempts]) / prompt_hash[k][:session_count].to_f 
      end

      prompt_hash
    end
end