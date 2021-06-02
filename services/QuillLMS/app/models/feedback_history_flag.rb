# == Schema Information
#
# Table name: feedback_history_flags
#
#  id                  :integer          not null, primary key
#  flag                :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  feedback_history_id :integer          not null
#
class FeedbackHistoryFlag < ActiveRecord::Base
  FLAG_TYPES = [
    FLAG_REPEATED_RULE_NON_CONSECUTIVE = 'repeated-non-consecutive',
    FLAG_REPEATED_RULE_CONSECUTIVE = 'repeated-consecutive'
  ]

  belongs_to :feedback_history
  validates :flag, presence: true, inclusion: {in: FLAG_TYPES}
end
