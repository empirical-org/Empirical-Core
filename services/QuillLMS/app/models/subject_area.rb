# frozen_string_literal: true

class SubjectArea < ApplicationRecord
  has_many :teacher_info_subject_areas
end
