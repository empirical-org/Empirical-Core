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
class FeedbackHistoryRatingSerializer < ActiveModel::Serializer
  attributes :id, :rating
end
