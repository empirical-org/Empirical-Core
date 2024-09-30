# frozen_string_literal: true

# == Schema Information
#
# Table name: student_learning_sequence_activities
#
#  id                           :bigint           not null, primary key
#  completed_at                 :datetime
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  activity_id                  :integer          not null
#  activity_session_id          :integer
#  classroom_unit_id            :integer          not null
#  student_learning_sequence_id :integer          not null
#
# Indexes
#
#  idx_on_classroom_unit_id_activity_id_e74613431d  (classroom_unit_id,activity_id)
#  idx_on_student_learning_sequence_id_63827699e9   (student_learning_sequence_id)
#
class StudentLearningSequenceActivity < ApplicationRecord
  belongs_to :activity
  belongs_to :classroom_unit
  belongs_to :student_learning_sequence

  validates :activity_id, presence: true
  validates :classroom_unit_id, presence: true
  validates :student_learning_sequence_id, presence: true
end
