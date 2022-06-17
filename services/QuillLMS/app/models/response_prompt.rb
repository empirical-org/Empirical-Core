# frozen_string_literal: true

# == Schema Information
#
# Table name: response_prompts
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_prompts_on_text  (text) UNIQUE
#
class ResponsePrompt < ApplicationRecord
  has_many :responses

  validates :text, uniqueness: true, presence: true
end
