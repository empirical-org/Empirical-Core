# frozen_string_literal: true

# == Schema Information
#
# Table name: response_question_types
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  index_response_question_types_on_text  (text) UNIQUE
#
class ResponseQuestionType < ApplicationRecord
  has_many :responses

  validates :text, uniqueness: true, length: { minimum: 1, allow_nil: false }
end
