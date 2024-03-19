# frozen_string_literal: true

module Staff
  class RulesAnalysisQuery < ::QuillBigQuery::Query
    attr_reader :activity_id, :conjunction, :start_date, :end_date, :activity_version

    def run
      run_query
    end

    def initialize(activity_id:, conjunction:, start_date: nil, end_date: nil, activity_version: nil, **options)
      @activity_id = activity_id
      @conjunction = conjunction
      @start_date = start_date
      @end_date = end_date
      @activity_version = activity_version
      super(**options)
    end

    def select_clause
      <<-SQL
        SELECT comprehension_rules.id,
        comprehension_rules.uid AS rules_uid,
        prompts.activity_id AS activity_id,
        comprehension_rules.rule_type AS rule_type,
        comprehension_rules.suborder AS rule_suborder,
        comprehension_rules.name AS rule_name,
        comprehension_rules.note AS rule_note,
        count(DISTINCT feedback_histories.id) AS total_responses,
        avg(DISTINCT CAST(JSON_VALUE(metadata, '$.api.confidence') AS FLOAT64)) AS avg_confidence,
        count(DISTINCT CASE WHEN feedback_history_ratings.rating = true THEN feedback_history_ratings.id END) AS total_strong,
        count(DISTINCT CASE WHEN feedback_history_ratings.rating = false THEN feedback_history_ratings.id END) AS total_weak,
        count(DISTINCT CASE WHEN feedback_history_flags.flag = 'repeated-consecutive' THEN feedback_history_flags.id END) AS repeated_consecutive,
        count(DISTINCT CASE WHEN feedback_history_flags.flag = 'repeated-non-consecutive' THEN feedback_history_flags.id END) AS repeated_non_consecutive
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.comprehension_rules
        INNER JOIN lms.comprehension_prompts_rules as prompts_rules ON comprehension_rules.id = prompts_rules.rule_id
        INNER JOIN lms.comprehension_prompts as prompts ON prompts_rules.prompt_id = prompts.id
        LEFT JOIN lms.feedback_histories ON feedback_histories.rule_uid = comprehension_rules.uid AND feedback_histories.prompt_id = prompts.id
        LEFT JOIN lms.feedback_history_ratings ON feedback_histories.id = feedback_history_ratings.feedback_history_id
        LEFT JOIN lms.feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id
      SQL
    end

    def start_date_where_clause
      start_date ? "AND feedback_histories.time >= '#{start_date}'" : ""
    end

    def end_date_where_clause
      end_date ? "AND feedback_histories.time <= '#{end_date}'" : ""
    end

    def activity_version_where_clause
      activity_version ? "AND feedback_histories.activity_version = #{activity_version}" : ""
    end

    def post_query_transform(query_result)
      rules_with_feedbacks = Evidence::Rule.where(id: query_result.pluck(:id)).includes(:feedbacks)
      query_result.map do |r|
        first_feedback, second_feedback = rules_with_feedbacks.find{|x| x.id == r[:id]}&.feedbacks&.sort_by(&:order)
        {
            rule_uid: r[:rules_uid],
            api_name: r[:rule_type],
            rule_order: r[:rule_suborder],
            first_feedback: first_feedback&.text || '',
            second_feedback: second_feedback&.text || '',
            rule_note: r[:rule_note],
            rule_name: r[:rule_name],
            avg_confidence: r[:avg_confidence] ? (r[:avg_confidence] * 100).round : nil,
            total_responses: r[:total_responses],
            strong_responses: r[:total_strong],
            weak_responses: r[:total_weak],
            repeated_consecutive_responses: r[:repeated_consecutive],
            repeated_non_consecutive_responses: r[:repeated_non_consecutive],
        }
      end

    end

    def group_by_clause
      <<-SQL
        GROUP BY comprehension_rules.id, rules_uid, activity_id, rule_type, rule_suborder, rule_name, rule_note
      SQL
    end

    def where_clause
      <<-SQL
        WHERE
          ((feedback_histories.used = TRUE OR feedback_histories.id IS NULL))
          AND (prompts.conjunction = '#{conjunction}' AND activity_id = #{activity_id} )
          #{start_date_where_clause}
          #{end_date_where_clause}
          #{activity_version_where_clause}
      SQL
    end

  end
end
