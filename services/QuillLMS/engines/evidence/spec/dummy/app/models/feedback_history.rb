class FeedbackHistory

  def self.save_feedback(feedback_hash_raw, entry, prompt_id, session_uid, attempt)
    feedback_hash = feedback_hash_raw.deep_stringify_keys

    {
      feedback_session_uid: session_uid,
      prompt_id: prompt_id,
      attempt: attempt,
      entry: entry,
      used: true,
      time: Time.zone.now,
      rule_uid: feedback_hash['rule_uid'],
      concept_uid: feedback_hash['concept_uid'],
      feedback_text: feedback_hash['feedback'],
      feedback_type: feedback_hash['feedback_type'],
      optimal: feedback_hash['optimal'],
      metadata: {
        highlight: feedback_hash['highlight'],
        labels: feedback_hash['labels'],
        hint: feedback_hash['hint']
      }
    }
  end

end
