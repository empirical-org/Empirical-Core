# frozen_string_literal: true

# == Schema Information
#
# Table name: response_directions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_directions_on_text  (text) UNIQUE
#
class ResponseDirections < ApplicationRecord
  has_many :responses

  validates :text, uniqueness: true, length: { minimum: 1, allow_nil: false }
end
