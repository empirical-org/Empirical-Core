# A specific aggregation pattern for FeedbackHistory records centered around
# `activity_session_uid`
class SessionFeedbackHistory
  DEFAULT_PAGE_SIZE = 25

  def self.list_by_activity_session(activity_id: nil, page: 1, page_size: DEFAULT_PAGE_SIZE)
    query = FeedbackHistory.select(%{
        feedback_histories.activity_session_uid AS session_uid,
        MIN(feedback_histories.time) AS start_date,
        comprehension_prompts.activity_id,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' THEN 1 END) AS because_attempts,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' THEN 1 END) AS but_attempts,
        COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' THEN 1 END) AS so_attempts,
        (
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'because' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'because' THEN comprehension_prompts.max_attempts END))) AND
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'but' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'but' THEN comprehension_prompts.max_attempts END))) AND
          ((COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' AND feedback_histories.optimal THEN 1 END) = 1) OR
            (COUNT(CASE WHEN comprehension_prompts.conjunction = 'so' THEN 1 END) = MAX(CASE WHEN comprehension_prompts.conjunction = 'so' THEN comprehension_prompts.max_attempts END)))
        ) AS complete
      })
      .joins("LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id")
      .where(used: true)
      .group(:activity_session_uid, :activity_id)
      .order('start_date DESC')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.limit(page_size)
    query = query.offset((page.to_i - 1) * page_size.to_i) if page && page.to_i > 1
    query
  end

  def self.serialize_list_by_activity_session(results)
    results.map do |r|
      {
        session_uid: r.session_uid,
        start_date: r.start_date.iso8601,
        activity_id: r.activity_id,
        because_attempts: r.because_attempts || 0,
        but_attempts: r.but_attempts || 0,
        so_attempts: r.so_attempts || 0,
        complete: r.complete || false
      }
    end
  end

  def self.serialize_detail_by_activity_session(activity_session_uid)
    histories = FeedbackHistory.where(activity_session_uid: activity_session_uid).all

    return nil if histories.empty?

    start_date = histories.first&.time
    activity_id = histories.first&.prompt&.activity_id
    because_attempts, because_complete = serialize_conjunction_feedback_history(histories, 'because')
    but_attempts, but_complete = serialize_conjunction_feedback_history(histories, 'but')
    so_attempts, so_complete = serialize_conjunction_feedback_history(histories, 'so')

    output = {
      start_date: start_date&.iso8601,
      session_uid: activity_session_uid,
      activity_id: activity_id,
      session_completed: because_complete && but_complete && so_complete,
      prompts: []
    }

    output[:prompts].push(because_attempts) if because_attempts[:prompt_id]
    output[:prompts].push(but_attempts) if but_attempts[:prompt_id]
    output[:prompts].push(so_attempts) if so_attempts[:prompt_id]

    output
  end

  private_class_method def self.serialize_conjunction_feedback_history(feedback_histories, conjunction=nil)
    feedback_histories = feedback_histories.filter { |h| h.prompt&.conjunction == conjunction } if conjunction

    conjunction_prompt = {
      prompt_id: feedback_histories.first&.prompt_id,
      conjunction: feedback_histories.first&.prompt&.conjunction,
      attempts: {}
    }

    feedback_histories.each do |feedback_history|
      conjunction_prompt[:attempts][feedback_history.attempt] ||= []
      conjunction_prompt[:attempts][feedback_history.attempt].push({
        used: feedback_history.used,
        entry: feedback_history.entry,
        feedback_text: feedback_history.feedback_text,
        feedback_type: feedback_history.feedback_type,
        optimal: feedback_history.optimal
      })
    end

    complete = conjunction_prompt[:attempts].values.any? do |attempt|
      attempt.any? { |entry| entry[:optimal] && entry[:used] }
    end

    [conjunction_prompt, complete]
  end
end
