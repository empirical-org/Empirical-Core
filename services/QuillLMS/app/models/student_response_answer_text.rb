# frozen_string_literal: true

# == Schema Information
#
# Table name: student_response_answer_texts
#
#  id         :bigint           not null, primary key
#  answer     :jsonb            not null
#  created_at :datetime         not null
#
class StudentResponseAnswerText < ApplicationRecord
  has_many :student_responses

  validates :answer, uniqueness: true, length: { minimum: 0, allow_nil: false }
end
