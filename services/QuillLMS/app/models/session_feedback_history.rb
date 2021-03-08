# A specific aggregation pattern for FeedbackHistory records centered around
# `activity_session_uid`
class SessionFeedbackHistory
  DEFAULT_PAGE_SIZE = 25

  def self.list_by_activity_session(activity_id: nil, page: 1, page_size: DEFAULT_PAGE_SIZE)
    query = FeedbackHistory.select('feedback_histories.activity_session_uid AS session_uid, min(feedback_histories.time) as start_date, comprehension_prompts.activity_id, max(because_feedback.attempt) AS because_attempts, max(but_feedback.attempt) AS but_attempts, max(so_feedback.attempt) AS so_attempts, (bool_or(because_feedback.optimal)::integer & bool_or(but_feedback.optimal)::integer & bool_or(so_feedback.optimal)::integer)::boolean AS complete').
      joins("LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id").
      joins("LEFT OUTER JOIN feedback_histories AS because_feedback ON feedback_histories.activity_session_uid = because_feedback.activity_session_uid AND comprehension_prompts.conjunction = 'because'").
      joins("LEFT OUTER JOIN feedback_histories AS but_feedback ON feedback_histories.activity_session_uid = but_feedback.activity_session_uid AND comprehension_prompts.conjunction = 'but'").
      joins("LEFT OUTER JOIN feedback_histories AS so_feedback ON feedback_histories.activity_session_uid = so_feedback.activity_session_uid AND comprehension_prompts.conjunction = 'so'").
      where(used: true).
      group(:activity_session_uid, :activity_id).
      order('start_date')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.limit(DEFAULT_PAGE_SIZE)
    query = query.offset((page.to_i - 1) * page_size.to_i) if page && page > 1
    query
  end

  def self.serialize_list_by_activity_session(results)
    results.map do |r|
      {
        session_uid: r.session_uid,
        start_date: r.start_date,
        activity_id: r.activity_id,
        because_attempts: r.because_attempts,
        but_attempts: r.but_attempts,
        so_attempts: r.so_attempts,
        complete: r.complete
      }
    end
  end
end
