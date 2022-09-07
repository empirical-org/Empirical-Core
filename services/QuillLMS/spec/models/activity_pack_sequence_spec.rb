# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint
#  diagnostic_activity_id :bigint
#
# Indexes
#
#  index_activity_pack_sequences_on_classroom_id            (classroom_id)
#  index_activity_pack_sequences_on_diagnostic_activity_id  (diagnostic_activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (diagnostic_activity_id => activities.id)
#
require 'rails_helper'

RSpec.describe ActivityPackSequence, type: :model do
  subject { create(:activity_pack_sequence) }

  it { should belong_to(:classroom) }
  it { should belong_to(:diagnostic_activity) }

  it { expect(subject).to be_valid }

  it { expect(subject.release_method).to eq ActivityPackSequence::STAGGERED_RELEASE }
end
