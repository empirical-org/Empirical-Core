# frozen_string_literal: true

# == Schema Information
#
# Table name: feedback_history_ratings
#
#  id                  :integer          not null, primary key
#  rating              :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  feedback_history_id :integer          not null
#  user_id             :integer          not null
#
# Indexes
#
#  feedback_history_ratings_uniqueness  (user_id,feedback_history_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class FeedbackHistoryRating < ApplicationRecord
  belongs_to :feedback_history
  belongs_to :user
end
