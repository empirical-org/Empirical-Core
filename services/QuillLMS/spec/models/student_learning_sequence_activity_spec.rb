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
require 'rails_helper'

RSpec.describe StudentLearningSequenceActivity, type: :model do
  it { expect(create(:student_learning_sequence_activity)).to be_valid }

  it { should belong_to(:student_learning_sequence) }
  it { should belong_to(:classroom_unit) }
  it { should belong_to(:activity) }

  it { should validate_presence_of(:student_learning_sequence_id) }
  it { should validate_presence_of(:classroom_unit_id) }
  it { should validate_presence_of(:activity_id) }
end
