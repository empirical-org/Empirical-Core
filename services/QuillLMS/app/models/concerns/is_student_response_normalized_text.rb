# frozen_string_literal: true

# This concern is intended to describe the many different tables that we use
# to normalize different types of text.  Basically these tables all do the
# same thing, but we wanted to keep the various concerns separated.
module IsStudentResponseNormalizedText
  extend ActiveSupport::Concern

  included do
    has_many :student_responses

    validates :text, uniqueness: true, length: { minimum: 0, allow_nil: false }
  end
end

