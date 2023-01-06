# frozen_string_literal: true

# == Schema Information
#
# Table name: subject_areas
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
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
