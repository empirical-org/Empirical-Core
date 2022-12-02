# frozen_string_literal: true

class SerializeEvidenceActivityHealth
  attr_reader :activity, :prompt_feedback_history

  def initialize(activity, prompt_feedback_history)
    @activity = activity
    @prompt_feedback_history = prompt_feedback_history
  end

  def data
    {
      name: activity.title,
      flag: activity.flag.to_s,
      activity_id: activity.id,
      version: activity.version,
      version_plays: FeedbackHistory.get_total_count({activity_id: activity.id, activity_version: activity.version}),
      total_plays: FeedbackHistory.get_total_count({activity_id: activity.id}),
      completion_rate: activity_feedback_history[:average_completion_rate],
      because_final_optimal: percent_final_optimal_for_conjunction(FeedbackHistory::BECAUSE),
      but_final_optimal: percent_final_optimal_for_conjunction(FeedbackHistory::BUT),
      so_final_optimal: percent_final_optimal_for_conjunction(FeedbackHistory::SO),
      avg_completion_time: activity_feedback_history[:average_time_spent] ? Utils::Numeric.human_readable_time_to_seconds(activity_feedback_history[:average_time_spent]) : nil,
    }
  end

  def prompt_data
    prompts = activity.prompts
    return [] if prompts.empty?

    prompts.map {|p| SerializeEvidencePromptHealth.new(p, prompt_feedback_history).data }
  end

  private def percent_final_optimal_for_conjunction(conjunction)
    prompt = activity.prompts.find_by(conjunction: conjunction)
    return nil unless prompt && prompt_feedback_history[prompt.id]

    ((prompt_feedback_history[prompt.id]["num_final_attempt_optimal"].to_f / prompt_feedback_history[prompt.id]["session_count"]) * 100).round
  end

  private def activity_feedback_history
    activity_feedback_history ||= ActivityFeedbackHistory.run({activity_id: activity.id, activity_version: activity.version})
  end

end
