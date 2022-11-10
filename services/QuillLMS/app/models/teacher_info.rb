# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                  :bigint           not null, primary key
#  minimum_grade_level :integer
#  maximum_grade_level :integer
#  teacher_id          :bigint
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
class TeacherInfo < ApplicationRecord
  belongs_to :teacher, :class_name => 'User'

  has_many :teacher_info_subject_areas, dependent: :destroy
  has_many :subject_areas, through: :teacher_info_subject_areas

  validates :minimum_grade_level, numericality: { in: 0..12 }
  validates :maximum_grade_level, numericality: { in: 0..12 }
  validates :teacher_id, presence: true, uniqueness: true

  KINDERGARTEN_DISPLAY_STRING = 'K'
  KINDERGARTEN_DATABASE_INTEGER = 0

  def minimum_grade_level=(value)
    value = KINDERGARTEN_DATABASE_INTEGER if value == KINDERGARTEN_DISPLAY_STRING
    super(value)
  end

  def maximum_grade_level=(value)
    value = KINDERGARTEN_DATABASE_INTEGER if value == KINDERGARTEN_DISPLAY_STRING
    super(value)
  end

  def minimum_grade_level
    return KINDERGARTEN_DISPLAY_STRING if self[:minimum_grade_level] == KINDERGARTEN_DATABASE_INTEGER

    super()
  end

  def maximum_grade_level
    return KINDERGARTEN_DISPLAY_STRING if self[:maximum_grade_level] == KINDERGARTEN_DATABASE_INTEGER
    
    super()
  end
end
