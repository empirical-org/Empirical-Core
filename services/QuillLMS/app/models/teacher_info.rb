# frozen_string_literal: true

class TeacherInfo < ApplicationRecord
  belongs_to :teacher, :class_name => 'User'

  has_many :teacher_info_subject_areas, dependent: :destroy
  has_many :subject_areas, through: :teacher_info_subject_areas
end
