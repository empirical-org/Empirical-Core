# frozen_string_literal: true

# == Schema Information
#
# Table name: student_activity_sequences
#
#  id                  :bigint           not null, primary key
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  classroom_id        :integer          not null
#  initial_activity_id :integer          not null
#  user_id             :integer          not null
#
require 'rails_helper'

RSpec.describe StudentActivitySequence, type: :model do
  it { expect(create(:student_activity_sequence)).to be_valid }

  it { should belong_to(:classroom) }
  it { should belong_to(:initial_activity).class_name('Activity') }
  it { should belong_to(:user) }

  it { should validate_presence_of(:classroom_id) }
  it { should validate_presence_of(:initial_activity_id) }
  it { should validate_presence_of(:user_id) }
end
