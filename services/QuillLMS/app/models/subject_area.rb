# frozen_string_literal: true

class SubjectArea < ApplicationRecord
  has_many :teacher_info_subject_areas, dependent: :destroy
  validates :name, presence: true, uniqueness: true

  NAMES = [
    'English / Language Arts / Reading',
    'English as a New Language',
    'General Elementary',
    'Math',
    'Science',
    'History / Social Studies',
    'Other'
  ]
end
