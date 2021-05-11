FactoryBot.define do
  factory :feedback_history_flag, class: 'FeedbackHistoryFlag' do
    association :feedback_history, factory: :feedback_history
    flag { FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE }
  end
end
