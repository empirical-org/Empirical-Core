# A specific aggregation pattern for FeedbackHistory records centered around
# `activity_session_uid`
class SessionFeedbackHistory
  DEFAULT_PAGE_SIZE = 25

  def self.list_by_activity_session(activity_id: nil, page: 1, page_size: DEFAULT_PAGE_SIZE)
    page = page.to_i
    query = FeedbackHistory.select('feedback_histories.activity_session_uid AS session_uid, min(feedback_histories.time) as start_date, comprehension_prompts.activity_id, max(because_feedback.attempt) AS because_attempts, max(but_feedback.attempt) AS but_attempts, max(so_feedback.attempt) AS so_attempts, (bool_or(because_feedback.optimal)::integer & bool_or(but_feedback.optimal)::integer & bool_or(so_feedback.optimal)::integer)::boolean AS complete')
      .joins("LEFT OUTER JOIN comprehension_prompts ON feedback_histories.prompt_id = comprehension_prompts.id")
      .joins("LEFT OUTER JOIN feedback_histories AS because_feedback ON feedback_histories.id = because_feedback.id AND comprehension_prompts.conjunction = 'because'")
      .joins("LEFT OUTER JOIN feedback_histories AS but_feedback ON feedback_histories.id = but_feedback.id AND comprehension_prompts.conjunction = 'but'")
      .joins("LEFT OUTER JOIN feedback_histories AS so_feedback ON feedback_histories.id = so_feedback.id AND comprehension_prompts.conjunction = 'so'")
      .where(used: true)
      .group(:activity_session_uid, :activity_id)
      .order('start_date DESC')
    query = query.where(comprehension_prompts: {activity_id: activity_id.to_i}) if activity_id
    query = query.limit(page_size)
    query = query.offset((page - 1) * page_size.to_i) if page && page > 1
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
