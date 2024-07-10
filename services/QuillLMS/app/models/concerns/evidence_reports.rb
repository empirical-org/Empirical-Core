# frozen_string_literal: true

module EvidenceReports
  extend ActiveSupport::Concern

  # this constant is also used on the frontend to generate hardcoded feedback for students to see (see services/QuillLMS/client/app/constants/evidence.ts) and should be updated there if it's updated here.
  EVIDENCE_SUBOPTIMAL_SPELLING_OR_GRAMMAR_FINAL_ATTEMPT_FEEDBACK = 'You completed four revisions! You’ve found the right piece of evidence, but there may still be spelling or grammar changes you could make to improve your sentence. Read your sentence one more time and think about what changes you could make. Then move on to the next prompt.'
  EVIDENCE_SUBOPTIMAL_FINAL_ATTEMPT_FEEDBACK = 'You completed four revisions!'
  EVIDENCE_OPTIMAL_FINAL_ATTEMPT_FEEDBACK = 'Nice work!'
  EVIDENCE_FINAL_ATTEMPT_NUMBER = 5
  EVIDENCE_SUBOPTIMAL_SPLIT_TEXT = 'Here are'

  def format_max_attempts_feedback(max_attempts_feedback)
    return nil unless max_attempts_feedback

    punctuation_mark_not_followed_by_a_space_regex = /(\.|,|;|!|\?)(?=\S)/

    # remove HTML, split to take everything before the split-off text, remove leading and trailing whitespace, and make sure any punctuation is followed by a space
    ActionView::Base.full_sanitizer.sanitize(max_attempts_feedback)
      .split(EVIDENCE_SUBOPTIMAL_SPLIT_TEXT)
      .first
      .strip
      .gsub(punctuation_mark_not_followed_by_a_space_regex, '\1 ')
  end

  def get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number)
    feedback_history = get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, attempt_number)
    feedback_history&.feedback_text
  end

  def get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, attempt_number)
    feedback_histories = activity_session.feedback_histories

    return nil if feedback_histories.empty? || prompt_text.blank? || attempt_number.blank?

    prompt = get_evidence_prompt_from_activity_and_prompt_text(activity_session, prompt_text)

    feedback_histories.find {|fh| fh.attempt == attempt_number.to_i && fh.prompt_id == prompt&.id }
  end

  def get_evidence_prompt_from_activity_and_prompt_text(activity_session, prompt_text)
    Evidence::Prompt
      .joins(:activity)
      .find_by(text: prompt_text, activity: {parent_activity_id: activity_session.activity_id})
  end

  def get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text)
    feedback_history = get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, EVIDENCE_FINAL_ATTEMPT_NUMBER)

    return EVIDENCE_SUBOPTIMAL_SPELLING_OR_GRAMMAR_FINAL_ATTEMPT_FEEDBACK if feedback_history&.spelling_or_grammar?

    prompt = get_evidence_prompt_from_activity_and_prompt_text(activity_session, prompt_text)

    format_max_attempts_feedback(prompt&.max_attempts_feedback) || EVIDENCE_SUBOPTIMAL_FINAL_ATTEMPT_FEEDBACK
  end

  private def evidence_final_attempt_feedback(activity_session, score, prompt_text, attempt_number)
    if score == 0 && attempt_number == EVIDENCE_FINAL_ATTEMPT_NUMBER
      get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text)
    else
      get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number) || EVIDENCE_OPTIMAL_FINAL_ATTEMPT_FEEDBACK
    end
  end
end
