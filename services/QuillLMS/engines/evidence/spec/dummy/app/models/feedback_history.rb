class FeedbackHistory
  def self.save_feedback(
    feedback_hash_raw:,
    entry:,
    prompt_id:,
    activity_session_uid:,
    attempt:,
    activity_version: 0,
    api_metadata: nil
  )

    feedback_hash = feedback_hash_raw.deep_stringify_keys

    {
      feedback_session_uid: activity_session_uid,
      prompt_id: prompt_id,
      attempt: attempt,
      entry: entry,
      used: true,
      time: Time.current,
      rule_uid: feedback_hash['rule_uid'],
      concept_uid: feedback_hash['concept_uid'],
      feedback_text: feedback_hash['feedback'],
      feedback_type: feedback_hash['feedback_type'],
      optimal: feedback_hash['optimal'],
      metadata: {
        highlight: feedback_hash['highlight'],
        labels: feedback_hash['labels'],
        hint: feedback_hash['hint']
      },
      activity_version: activity_version,
      api: api_metadata
    }.reject {|_,v| v.blank? }
  end

end
