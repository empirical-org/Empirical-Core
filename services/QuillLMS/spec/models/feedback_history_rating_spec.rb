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
require 'rails_helper'

RSpec.describe FeedbackHistoryRating, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
