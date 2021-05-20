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

    def self.feedback_history_to_json(f_h)
        {
            response_id: f_h.id,
            datetime: f_h.updated_at,
            entry: f_h.entry,
            highlight: f_h.metadata.class == Hash ? f_h.metadata['highlight'] : '',
            session_uid: f_h.feedback_session_uid,
            strength: f_h.feedback_history_ratings.order(updated_at: :desc).first&.rating
        }
    end

    def self.generate_rulewise_report(rule_uid:, prompt_id: )
        feedback_histories = FeedbackHistory.where(rule_uid: rule_uid, prompt_id: prompt_id, used: true)
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
                .where(id: r.feedback_histories_id_array).includes(:feedback_history_ratings).includes(:feedback_history_flags)

            total_scored = feedback_histories.reduce(0) do |memo, feedback_history|
                memo + feedback_history.feedback_history_ratings.count
            end

            total_strong = 0
            total_weak = 0
            repeated_consecutive = 0
            repeated_non_consecutive = 0
            if total_scored > 0
                feedback_histories.each do |history|
                  total_strong += 1 if history.feedback_history_ratings.any?(&:rating)
                  total_weak += 1 if history.feedback_history_ratings.any? { |hr| hr.rating == false }
                  repeated_consecutive += 1 if history.feedback_history_flags.any? { |f| f.flag == FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE }
                  repeated_non_consecutive += 1 if history.feedback_history_flags.any? { |f| f.flag == FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE }
                end

            end
            r.define_singleton_method(:total_strong) { total_strong }
            r.define_singleton_method(:total_weak) { total_weak }
            r.define_singleton_method(:repeated_consecutive) { repeated_consecutive }
            r.define_singleton_method(:repeated_non_consecutive) { repeated_non_consecutive }

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
                strong_responses: r.total_strong,
                weak_responses: r.total_weak,
                repeated_consecutive_responses: r.repeated_consecutive,
                repeated_non_consecutive_responses: r.repeated_non_consecutive,
            }

        end
    end
end
