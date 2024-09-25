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
# Indexes
#
#  idx_on_user_id_initial_activity_id_initial_classroo_868ab8c89e  (user_id,initial_activity_id,initial_classroom_unit_id)
#
require 'rails_helper'

RSpec.describe StudentLearningSequence, type: :model do
  it { expect(create(:student_learning_sequence)).to be_valid }

  it { should belong_to(:initial_activity).class_name('Activity') }
  it { should belong_to(:initial_classroom_unit).class_name('ClassroomUnit') }
  it { should belong_to(:user) }

  it { should have_many(:student_learning_sequence_activities) }

  it { should validate_presence_of(:initial_activity_id) }
  it { should validate_presence_of(:initial_classroom_unit_id) }
  it { should validate_presence_of(:user_id) }
end
