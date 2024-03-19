# frozen_string_literal: true

class RuleFeedbackHistory

  def self.feedback_history_to_json(f_h)
    {
        response_id: f_h.id,
        datetime: f_h.updated_at,
        entry: f_h.entry,
        highlight: f_h.metadata.instance_of?(Hash) ? f_h.metadata['highlight'] : '',
        session_uid: f_h.feedback_session_uid,
        strength: f_h.feedback_history_ratings.max_by(&:updated_at)&.rating,
        api: f_h.metadata.instance_of?(Hash) ? f_h.metadata['api'] || {} : {}
    }
  end

  def self.generate_rulewise_report(rule_uid:, prompt_id:, start_date: nil, end_date: nil)
    start_filter = start_date ? ["feedback_histories.created_at >= ?", start_date] : []
    end_filter = end_date ? ["feedback_histories.created_at <= ?", end_date] : []

    feedback_histories = FeedbackHistory.where(rule_uid: rule_uid, prompt_id: prompt_id, used: true).includes(:feedback_history_ratings)
    .where(start_filter)
    .where(end_filter)

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

end
