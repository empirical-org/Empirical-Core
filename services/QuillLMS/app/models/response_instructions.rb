# frozen_string_literal: true

# == Schema Information
#
# Table name: response_instructions
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_instructions_on_text  (text) UNIQUE
#
class ResponseInstructions < ApplicationRecord
  has_many :responses

  validates :text, uniqueness: true, presence: true
end
