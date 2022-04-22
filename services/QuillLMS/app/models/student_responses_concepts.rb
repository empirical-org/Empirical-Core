# frozen_string_literal: true

class StudentResponsesConcepts < ApplicationRecord
  belongs_to :student_response
  belongs_to :concept
end
