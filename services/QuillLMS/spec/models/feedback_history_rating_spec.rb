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
require 'rails_helper'

RSpec.describe FeedbackHistoryRating, type: :model do
  it 'should test uniqueness on user_id and feedback_history_id' do
    user = create(:user)
    params = {
      user_id: user.id,
      feedback_history_id: 1
    }
    create(:feedback_history_rating, **params)
    expect do
      create(:feedback_history_rating, **params)
    end.to raise_error(ActiveRecord::RecordNotUnique)
  end
end
