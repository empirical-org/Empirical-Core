# frozen_string_literal: true

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
FactoryBot.define do
  factory :feedback_history_flag do
    association :feedback_history, factory: :feedback_history
    flag { FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE }
  end
end
