# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_infos
#
#  id                  :bigint           not null, primary key
#  maximum_grade_level :integer
#  minimum_grade_level :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_teacher_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class TeacherInfo < ApplicationRecord
  belongs_to :user

  has_many :teacher_info_subject_areas, dependent: :destroy
  has_many :subject_areas, through: :teacher_info_subject_areas

  validates :minimum_grade_level, numericality: { in: 0..12 }, :allow_nil => true
  validates :maximum_grade_level, numericality: { in: 0..12 }, :allow_nil => true
  validates :user_id, presence: true, uniqueness: true

  KINDERGARTEN_DISPLAY_STRING = 'K'
  KINDERGARTEN_DATABASE_INTEGER = 0

  EIGHT_TO_TWELVE = (8..12).to_a

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

  def teacher
    user
  end

  def teacher_id
    user_id
  end

  def teacher=(value)
    self.user = value
  end

  def teacher_id=(value)
    self.user_id = value
  end

  def grade_levels
    return [] if no_grade_levels?

    return [maximum_grade_level] if minimum_grade_level.nil?
    return [minimum_grade_level] if maximum_grade_level.nil?

    (self[:minimum_grade_level]..self[:maximum_grade_level]).to_a
  end

  def in_eighth_through_twelfth?
    grade_levels.intersection(EIGHT_TO_TWELVE).present?
  end

  def subject_areas_string
    subject_areas&.map(&:name)&.join(", ")
  end

  private def no_grade_levels?
    minimum_grade_level.nil? && maximum_grade_level.nil?
  end
end
