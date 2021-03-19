# == Schema Information
#
# Table name: feedback_history_ratings
#
#  id                  :integer          not null, primary key
#  rating              :string           not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  feedback_history_id :integer          not null
#  user_id             :integer          not null
#
class FeedbackHistoryRating < ActiveRecord::Base
    RATINGS = %w(strong weak unrated)
    belongs_to :feedback_history 
    belongs_to :user
    validates :rating, presence: true, inclusion: {in: RATINGS}
end
