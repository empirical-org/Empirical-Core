# frozen_string_literal: true

module IsStudentResponseNormalizedText
  extend ActiveSupport::Concern

  included do
    has_many :student_responses

    validates :text, uniqueness: true, length: { minimum: 0, allow_nil: false }
  end
end

