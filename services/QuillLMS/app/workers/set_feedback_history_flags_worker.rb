class SetFeedbackHistoryFlagsWorker
  include Sidekiq::Worker

  def perform(feedback_history_id)
    @feedback_history = FeedbackHistory.find(feedback_history_id)

    set_repeated_rule_violation_flag
  end

  private def set_repeated_rule_violation_flag
    if @feedback_history.rule_violation_consecutive_repititions?
      return FeedbackHistoryFlag.create!(
        feedback_history: @feedback_history,
        flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE
      )
    elsif @feedback_history.rule_violation_repititions?
      return FeedbackHistoryFlag.create!(
        feedback_history: @feedback_history,
        flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE
      )
    end
  end
end
