# frozen_string_literal: true

class SerializeEvidencePromptHealth

  def initialize(prompt, prompt_feedback_history)
    @prompt = prompt
    @prompt_feedback_history = prompt_feedback_history
  end

  def data
    {
      prompt_id: @prompt.id,
      activity_short_name: @prompt.activity.notes,
      text: @prompt.text,
      current_version: @prompt.activity.version,
      version_responses: @prompt_feedback_history[@prompt.id]["total_responses"],
      first_attempt_optimal: num_first_attempts > 0 ? ((@prompt_feedback_history[@prompt.id]["num_first_attempt_optimal"] / num_first_attempts.to_f) * 100).round : nil,
      final_attempt_optimal: num_final_attempts > 0 ? ((@prompt_feedback_history[@prompt.id]["num_final_attempt_optimal"] / num_final_attempts.to_f) * 100).round : nil,
      avg_attempts: @prompt_feedback_history[@prompt.id]["avg_attempts"].round(1),
      confidence: @prompt_feedback_history[@prompt.id]["avg_confidence"] ? @prompt_feedback_history[@prompt.id]["avg_confidence"] / 100 : nil,
      percent_automl_consecutive_repeated: percent_automl_consecutive_repeated,
      percent_automl: percent_responses_for_api(FeedbackHistory::AUTO_ML),
      percent_plagiarism: percent_responses_for_api(FeedbackHistory::PLAGIARISM),
      percent_opinion: percent_responses_for_api(FeedbackHistory::OPINION),
      percent_grammar: percent_responses_for_api(FeedbackHistory::GRAMMAR),
      percent_spelling: percent_responses_for_api(FeedbackHistory::SPELLING),
      avg_time_spent_per_prompt: @prompt_feedback_history[@prompt.id]["avg_time_spent"] ? Utils::Numeric.human_readable_time_to_seconds(@prompt_feedback_history[@prompt.id]["avg_time_spent"]) : nil
    }
  end

  private def rule_feedback_histories
    @rule_feedback_histories ||= RuleFeedbackHistory.generate_report({activity_id: @prompt.activity.id, conjunction: @prompt.conjunction, activity_version: @prompt.activity.version})
  end

  private def total_responses
    @total_responses ||= rule_feedback_histories.map { |fh| fh[:total_responses] }.sum || 0
  end

  private def num_first_attempts
    @prompt_feedback_history[@prompt.id]["num_first_attempt_optimal"] + @prompt_feedback_history[@prompt.id]["num_first_attempt_not_optimal"]
  end

  private def num_final_attempts
    @prompt_feedback_history[@prompt.id]["num_final_attempt_optimal"] + @prompt_feedback_history[@prompt.id]["num_final_attempt_not_optimal"]
  end

  private def percent_responses_for_api(api_type)
    return nil if total_responses == 0

    (((rule_feedback_histories.select {|fh| fh[:api_name] == api_type }.map { |fh| fh[:total_responses]}.sum || 0) / total_responses.to_f) * 100).round
  end

  private def percent_automl_consecutive_repeated
    automl_histories = rule_feedback_histories.select {|fh| fh[:api_name] == FeedbackHistory::AUTO_ML }
    return nil if automl_histories.empty?

    total_responses = automl_histories.map { |fh| fh[:total_responses] }.sum
    repeated_consecutive = automl_histories.map { |fh| fh[:repeated_consecutive_responses] }.sum

    ((repeated_consecutive / total_responses.to_f) * 100).round
  end

end
