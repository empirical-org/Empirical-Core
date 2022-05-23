# frozen_string_literal: true

class RuleFeedbackHistory
  def self.generate_report(conjunction:, activity_id:, start_date: nil, end_date: nil, turk_session_id: nil)
    sql_result = exec_query(conjunction: conjunction, activity_id: activity_id, start_date: start_date, end_date: end_date, turk_session_id: turk_session_id)
    format_sql_results(sql_result)
  end

  def self.exec_query(conjunction:, activity_id:, start_date:, end_date:, turk_session_id:)
    query = Evidence::Rule.select(<<~SELECT
      comprehension_rules.id,
      comprehension_rules.uid AS rules_uid,
      prompts.activity_id AS activity_id,
      comprehension_rules.rule_type AS rule_type,
      comprehension_rules.suborder AS rule_suborder,
      comprehension_rules.name AS rule_name,
      comprehension_rules.note AS rule_note,
      count(DISTINCT feedback_histories.id) AS total_responses,
      count(DISTINCT CASE WHEN feedback_history_ratings.rating = true THEN feedback_history_ratings.id END) AS total_strong,
      count(DISTINCT CASE WHEN feedback_history_ratings.rating = false THEN feedback_history_ratings.id END) AS total_weak,
      count(DISTINCT CASE WHEN feedback_history_flags.flag = '#{FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE}' THEN feedback_history_flags.id END) AS repeated_consecutive,
      count(DISTINCT CASE WHEN feedback_history_flags.flag = '#{FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE}' THEN feedback_history_flags.id END) AS repeated_non_consecutive
    SELECT
    )
    .joins('INNER JOIN comprehension_prompts_rules as prompts_rules ON comprehension_rules.id = prompts_rules.rule_id')
    .joins('INNER JOIN comprehension_prompts as prompts ON prompts_rules.prompt_id = prompts.id')
    .joins('LEFT JOIN feedback_histories ON feedback_histories.rule_uid = comprehension_rules.uid AND feedback_histories.prompt_id = prompts.id')
    .joins('LEFT JOIN feedback_history_ratings ON feedback_histories.id = feedback_history_ratings.feedback_history_id')
    .joins('LEFT JOIN feedback_history_flags ON feedback_histories.id = feedback_history_flags.feedback_history_id')
    .where("(feedback_histories.used = ? OR feedback_histories.id IS NULL)", true)
    .where("prompts.conjunction = ? AND activity_id = ?", conjunction, activity_id)
    .group('comprehension_rules.id, rules_uid, activity_id, rule_type, rule_suborder, rule_name, rule_note')
    .includes(:feedbacks)
    query = query.where("feedback_histories.time >= ?", start_date) if start_date
    query = query.where("feedback_histories.time <= ?", end_date) if end_date
    if turk_session_id
      query = query.joins('LEFT JOIN feedback_sessions ON feedback_histories.feedback_session_uid = feedback_sessions.uid')
      .joins('LEFT JOIN comprehension_turking_round_activity_sessions ON feedback_sessions.activity_session_uid = comprehension_turking_round_activity_sessions.activity_session_uid')
      .where("comprehension_turking_round_activity_sessions.turking_round_id = ?", turk_session_id)
    end
    query
  end

  def self.feedback_history_to_json(f_h)
    {
        response_id: f_h.id,
        datetime: f_h.updated_at,
        entry: f_h.entry,
        highlight: f_h.metadata.instance_of?(Hash) ? f_h.metadata['highlight'] : '',
        session_uid: f_h.feedback_session_uid,
        strength: f_h.feedback_history_ratings.order(updated_at: :desc).first&.rating
    }
  end

  def self.generate_rulewise_report(rule_uid:, prompt_id:, start_date: nil, end_date: nil, turk_session_id: nil)
    start_filter = start_date ? ["feedback_histories.created_at >= ?", start_date] : []
    end_filter = end_date ? ["feedback_histories.created_at <= ?", end_date] : []

    feedback_histories = FeedbackHistory.where(rule_uid: rule_uid, prompt_id: prompt_id, used: true)
    .where(start_filter)
    .where(end_filter)

    #binding.pry

    if turk_session_id
      feedback_histories = feedback_histories.joins('LEFT JOIN feedback_sessions ON feedback_histories.feedback_session_uid = feedback_sessions.uid')
      feedback_histories = feedback_histories.joins('LEFT JOIN comprehension_turking_round_activity_sessions ON feedback_sessions.activity_session_uid = comprehension_turking_round_activity_sessions.activity_session_uid')
      feedback_histories = feedback_histories.where("comprehension_turking_round_activity_sessions.turking_round_id = ?", turk_session_id)
    end

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

  def self.format_sql_results(relations)
    relations.map do |r|
      {
          rule_uid: r.rules_uid,
          api_name: r.rule_type,
          rule_order: r.rule_suborder,
          first_feedback: r.feedbacks.order(:order).first&.text || '',
          second_feedback: r.feedbacks.order(:order).second&.text || '',
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
