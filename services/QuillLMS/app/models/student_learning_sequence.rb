# frozen_string_literal: true

# == Schema Information
#
# Table name: student_learning_sequences
#
#  id                        :bigint           not null, primary key
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  initial_activity_id       :integer          not null
#  initial_classroom_unit_id :integer          not null
#  user_id                   :integer          not null
#
class StudentLearningSequence < ApplicationRecord
  belongs_to :initial_activity, class_name: 'Activity'
  belongs_to :initial_classroom_unit, class_name: 'ClassroomUnit'
  belongs_to :user

  has_many :student_learning_sequence_activities

  validates :initial_activity_id, presence: true
  validates :initial_classroom_unit_id, presence: true
  validates :user_id, presence: true
end
