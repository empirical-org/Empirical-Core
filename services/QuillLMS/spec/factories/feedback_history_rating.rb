FactoryBot.define do
  factory :feedback_history_rating, class: FeedbackHistoryRating do
    rating FeedbackHistoryRating::RATINGS.first
  end

end
