class RuleFeedbackHistory
    def self.generate_report(conjunction:, activity_id:)
        sql_result = exec_query(conjunction: conjunction, activity_id: activity_id)
        postprocessed = postprocessing(sql_result)
        format_sql_results(postprocessed)
    end

    def self.exec_query(conjunction:, activity_id:)
        sql = <<~SQL
          select rules.uid as rules_uid,
          feedback_histories.feedback_history_ids as feedback_histories_id_array,
            prompts.activity_id as activity_id,
            rules.rule_type as rule_type,
            rules.suborder as rule_suborder,
            rules.name as rule_name,
            rules.note as rule_note
            FROM comprehension_rules as rules
            INNER JOIN comprehension_prompts_rules as prompts_rules ON rules.id = prompts_rules.rule_id
            INNER JOIN comprehension_prompts as prompts ON prompts_rules.prompt_id = prompts.id
            LEFT JOIN feedback_histories_grouped_by_rule_uid as feedback_histories ON feedback_histories.rule_uid = rules.uid
            WHERE prompts.conjunction = '#{conjunction}' AND activity_id = '#{activity_id}'
        SQL
        rules = Comprehension::Rule.find_by_sql(sql)
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
            puts "operating on prompt session: #{prompt_session}"
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

    def self.decorate(prompt_wise_hash)


    end

    def self.feedback_history_to_json(f_h)
        {
            response_id: f_h.id,
            datetime: f_h.updated_at,
            entry: f_h.entry,
            highlight: f_h.metadata.class == Hash ? f_h.metadata['highlight'] : '',
            view_session_url: 'Not yet available',
            strength: f_h.feedback_history_ratings.order(updated_at: :desc).first&.rating
        }
    end

    def self.generate_rulewise_report(rule_uid:, prompt_id: )
        feedback_histories = FeedbackHistory.where(rule_uid: rule_uid, prompt_id: prompt_id)
        response_jsons = []
        feedback_histories.each do |f_h|
            response_jsons.append(feedback_history_to_json(f_h))
        end

        {
            "#{rule_uid}": {
                responses: response_jsons
            }
        }
    end

    def self.postprocessing(rules_sql_result)
        rules_sql_result.each do |r|

            feedback_histories = FeedbackHistory
                .where(id: r.feedback_histories_id_array).includes(:feedback_history_ratings)

            total_scored = feedback_histories.reduce(0) do |memo, feedback_history|
                memo + feedback_history.feedback_history_ratings.count
            end

            if total_scored == 0
                total_strong = 0
                r.define_singleton_method(:pct_strong) { 0 }
                r.define_singleton_method(:pct_scored) { 0 }
            else
                total_strong = feedback_histories.reduce(0) do |memo, n|
                    memo + n.feedback_history_ratings.filter(&:rating).count
                end

                r.define_singleton_method(:pct_strong) { total_strong/total_scored.to_f }
                # note: pct_scored may be over counting since the original spec may not
                # account for one feedback history having more than one score.
                r.define_singleton_method(:pct_scored) { total_scored/total_scored.to_f }
            end

            r.define_singleton_method(:scored_responses_count) { total_scored }
            r.define_singleton_method(:total_responses) { feedback_histories.count }
        end

        rule_feedbacks = Comprehension::Rule
            .includes(:feedbacks)
            .where(uid: rules_sql_result.map(&:rules_uid))

        rules_sql_result.each do |r|
            feedbacks = rule_feedbacks.find_by(uid: r.rules_uid).feedbacks
            r.first_feedback = feedbacks.empty? ? '' : feedbacks.min_by {|f| f.order}.text
        end

        rules_sql_result
    end

    def self.format_pct(a_float)
        "#{(a_float * 100).round(2)}%"
    end

    def self.format_sql_results(relations)
        relations.map do |r|
            {
                rule_uid: r.rules_uid,
                api_name: r.rule_type,
                rule_order: r.rule_suborder,
                first_feedback: r.first_feedback,
                rule_note: r.rule_note,
                rule_name: r.rule_name,
                total_responses: r.total_responses,
                pct_strong: format_pct(r.pct_strong),
                scored_responses: r.scored_responses_count, # may want to rename for clarity
                pct_scored: format_pct(r.pct_scored)
            }

        end
    end
end
