class FeedbackHistoryFlag < ActiveRecord::Base
  FLAG_TYPES = [
    FLAG_REPEATED_RULE_NON_CONSECUTIVE = 'repeated-non-consecutive',
    FLAG_REPEATED_RULE_CONSECUTIVE = 'repeated-consecutive'
  ]

  belongs_to :feedback_history
  validates :flag, presence: true, inclusion: {in: FLAG_TYPES}
end
