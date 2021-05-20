class PromptFeedbackHistory

    def self.run(activity_id)
        promptwise_postprocessing promptwise_sessions(activity_id)
    end

    def self.promptwise_sessions(activity_id)
        sql = <<~SQL 
          SELECT prompt_id, feedback_session_uid, 
            count(*) as session_count, 
            bool_or(optimal) as at_least_one_optimal, 
            MAX(attempt) as attempt_cardinal,
            ARRAY_AGG(rule_uid) as rule_uids,
            -- assumes that multiple ARRAY_AGG functions process data in the same sequence
            ARRAY_AGG(attempt) as attempts,
            ARRAY_AGG(optimal) as optimals
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
            prompt_id = prompt_session.prompt_id.to_s.to_sym

            prompt_hash[prompt_id] ||= {

                total_responses: 0.0,
                session_count: 0.0, 
                optimal_attempt_array: [],
                display_name: '',

                pct_final_attempt_optimal: 0.0,
                pct_final_attempt_not_optimal: 0.0,
                num_final_attempt_optimal: 0.0,
                num_final_attempt_not_optimal: 0.0,

                avg_attempts_to_optimal: 0.0,

                num_consecutive_repeated_attempts_for_same_rule: 0.0,
                num_non_consecutive_repeated_attempts_for_same_rule: 0.0,
                pct_consecutive_repeated_attempts_for_same_rule: 0.0,
                pct_non_consecutive_repeated_attempts_for_same_rule: 0.0,

                num_first_attempt_optimal: 0.0,
                num_first_attempt_not_optimal: 0.0,
                pct_first_attempt_optimal: 0.0,
                pct_first_attempt_not_optimal: 0.0
            }

            prompt_hash[prompt_id][:display_name] = prompts.find(prompt_session.prompt_id).text

            if first_attempt_optimal?(prompt_session.attempts, prompt_session.optimals)
              prompt_hash[prompt_id][:num_first_attempt_optimal] += 1
            else 
              prompt_hash[prompt_id][:num_first_attempt_not_optimal] += 1 
            end

            if has_consecutive_repeated_rule?(prompt_session.attempts, prompt_session.rule_uids)
              prompt_hash[prompt_id][:num_consecutive_repeated_attempts_for_same_rule] += 1
            end 

            if has_non_consecutive_repeated_rule?(prompt_session.rule_uids)
              prompt_hash[prompt_id][:num_non_consecutive_repeated_attempts_for_same_rule] += 1
            end 

            if prompt_session.at_least_one_optimal
              prompt_hash[prompt_id][:num_final_attempt_optimal] += 1
              prompt_hash[prompt_id][:optimal_attempt_array].append prompt_session.attempt_cardinal
            else 
              prompt_hash[prompt_id][:num_final_attempt_not_optimal] += 1
            end

            prompt_hash[prompt_id][:total_responses] += prompt_session.session_count
            prompt_hash[prompt_id][:session_count] += 1
        end
        apply_summations(prompt_hash)
    end

    def self.apply_summations(prompt_hash)
      prompt_hash.each do |k,v|
        session_count = prompt_hash[k][:session_count].to_f

        if v[:num_final_attempt_optimal] == 0
          prompt_hash[k][:avg_attempts_to_optimal] = 0.0
        else 
          prompt_hash[k][:avg_attempts_to_optimal] = v[:optimal_attempt_array].sum / v[:num_final_attempt_optimal].to_f
        end

         prompt_hash[k][:num_consecutive_repeated_attempts_for_same_rule] = \
          v[:num_consecutive_repeated_attempts_for_same_rule] / v[:session_count].to_f

        prompt_hash[k][:num_non_consecutive_repeated_attempts_for_same_rule] = \
          v[:num_non_consecutive_repeated_attempts_for_same_rule] / v[:session_count].to_f

        prompt_hash[k][:pct_final_attempt_optimal] = \
          prompt_hash[k][:num_final_attempt_optimal] / session_count      

        prompt_hash[k][:pct_final_attempt_not_optimal] = \
          prompt_hash[k][:num_final_attempt_not_optimal] / session_count
          
        prompt_hash[k][:pct_first_attempt_optimal] = v[:num_first_attempt_optimal] / session_count
        prompt_hash[k][:pct_first_attempt_not_optimal] = v[:num_first_attempt_not_optimal] / session_count
        
        v.delete_if {|k,v| k == :optimal_attempt_array}
        v.delete_if {|k,v| k == :num_first_attempt_optimal}
      end

      prompt_hash
    end

    def self.first_attempt_optimal?(attempts_array, optimals_array)
      attempts_rule_uids = attempts_array.zip(optimals_array).sort{|a, b| a.first <=> b.first } 
      attempts_rule_uids.first.last 
    end

    def self.has_non_consecutive_repeated_rule?(rule_array)
      rule_array.uniq.count != rule_array.count
    end

    def self.has_consecutive_repeated_rule?(attempts_array, rule_array)
      attempts_rule_uids = attempts_array.zip(rule_array).sort{|a, b| a.first <=> b.first }

      (0...attempts_rule_uids.length-1).each do |idx|
        if attempts_rule_uids[idx].last == attempts_rule_uids[idx+1].last 
          return true
        end 
      end 
      return false
    end
end