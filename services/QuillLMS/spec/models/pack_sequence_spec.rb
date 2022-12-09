# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequences
#
#  id                     :bigint           not null, primary key
#  release_method         :string           default("staggered")
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  classroom_id           :bigint           not null
#  diagnostic_activity_id :bigint           not null
#
# Indexes
#
#  index_pack_sequences_on_classroom_id                             (classroom_id)
#  index_pack_sequences_on_classroom_id_and_diagnostic_activity_id  (classroom_id,diagnostic_activity_id) UNIQUE
#  index_pack_sequences_on_diagnostic_activity_id                   (diagnostic_activity_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (diagnostic_activity_id => activities.id)
#
require 'rails_helper'

RSpec.describe PackSequence, type: :model do
  subject { create(:pack_sequence) }

  it { should belong_to(:classroom) }
  it { should belong_to(:diagnostic_activity) }

  it { expect(subject).to be_valid }

  it { expect(subject.release_method).to eq PackSequence::STAGGERED_RELEASE }

  context 'constraints' do
    context 'uniqueness of classroom and diagnostic_activity' do
      let(:pack_sequence) { create(:pack_sequence) }

      let(:duplicate_pack_sequence) do
        create(:pack_sequence,
          classroom: pack_sequence.classroom,
          diagnostic_activity: pack_sequence.diagnostic_activity
        )
      end

      it { expect { duplicate_pack_sequence }.to raise_error ActiveRecord::RecordNotUnique }
    end
  end
end
