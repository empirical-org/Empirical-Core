# frozen_string_literal: true

class StudentResponseNormalizedText < ApplicationRecord
  self.abstract_class = true

  has_many :student_responses

  validates :text, unique: true, length: { minimum: 0, allow_nil: false }
end
