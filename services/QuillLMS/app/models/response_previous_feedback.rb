# frozen_string_literal: true

# == Schema Information
#
# Table name: response_previous_feedbacks
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_previous_feedbacks_on_text  (text) UNIQUE
#
class ResponsePreviousFeedback < ApplicationRecord
  has_many :responses

  validates :text, uniqueness: true, presence: true
end
