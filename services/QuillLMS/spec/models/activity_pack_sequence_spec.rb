# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequences
#
#  id             :bigint           not null, primary key
#  release_method :string           default("immediate")
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  activity_id    :bigint
#  classroom_id   :bigint
#
# Indexes
#
#  index_activity_pack_sequences_on_activity_id   (activity_id)
#  index_activity_pack_sequences_on_classroom_id  (classroom_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (classroom_id => classrooms.id)
#
require 'rails_helper'

RSpec.describe ActivityPackSequence, type: :model do
  subject { create(:activity_pack_sequence) }

  it { should belong_to(:classroom) }
  it { should belong_to(:source) }

  it { expect(subject).to be_valid }

  it { expect(subject.release_method).to eq described_class::IMMEDIATE_RELEASE }
end
