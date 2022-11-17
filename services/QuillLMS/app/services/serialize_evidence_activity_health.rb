# frozen_string_literal: true

class SerializeEvidenceActivityHealth

  def initialize(activity)
    @activity = activity
  end

  def data
    {
      name: @activity.title,
      flag: @activity.flag,
      activity_id: @activity.id,
      version: @activity.version,
      version_plays: FeedbackHistory.get_total_count({activity_id: @activity.id, activity_version: @activity.version}),
      total_plays: FeedbackHistory.get_total_count({activity_id: @activity.id}),
      completion_rate: activity_feedback_history[:average_completion_rate],
      because_final_optimal: percent_final_optimal_for_conjunction(Evidence::FeedbackHistory::CONJUNCTIONS::BECAUSE),
      but_final_optimal: percent_final_optimal_for_conjunction(Evidence::FeedbackHistory::CONJUNCTIONS::BUT),
      so_final_optimal: percent_final_optimal_for_conjunction(Evidence::FeedbackHistory::CONJUNCTIONS::SO),
      avg_completion_time: activity_feedback_history[:average_time_spent],
    }
  end

  def prompt_data
    questions = @activity.data["questions"]
    return [] if !questions.present?
  end

  private def percent_final_optimal_for_conjunction(conjunction)
    prompt = @activity.prompts.find_by(conjunction: conjunction)
    return unless prompt.present?

    (prompt_feedback_history[prompt.id][:num_final_attempt_optimal].to_f / prompt_feedback_history[prompt.id][:session_count]).round
  end

  private def activity_feedback_history
    @activity_feedback_history ||= ActivityFeedbackHistory.run({activity_id: @activity.id, activity_version: @activity.version})
  end

  private def prompt_feedback_history
    @prompt_feedback_history ||= PromptFeedbackHistory.run({activity_id: @activity.id, activity_version: @activity.version})
  end

end
