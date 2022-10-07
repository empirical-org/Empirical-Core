# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityPackSequenceGetter do
  subject { described_class.run(classroom_id, diagnostic_activity_id, release_method) }

  let(:classroom_id) { create(:classroom).id }
  let(:diagnostic_activity_id) { create(:diagnostic_activity).id }

  let(:activity_pack_sequence) do
    create(:activity_pack_sequence,
      classroom_id: classroom_id,
      diagnostic_activity_id: diagnostic_activity_id,
      release_method: ActivityPackSequence::STAGGERED_RELEASE
    )
  end

  context 'release method is staggered release' do
    let(:release_method) { ActivityPackSequence::STAGGERED_RELEASE }

    context 'Activity Pack Sequence does not exist' do
      it { expect(subject).to be_a ActivityPackSequence }
    end

    context 'Activity Pack Sequence already exists' do
      before { activity_pack_sequence }

      it { expect(subject).to eq activity_pack_sequence }
    end
  end

  context 'release method is not staggered release' do
    let(:release_method) { nil }

    it { expect(subject).to eq nil }

    context 'Activity Pack Sequence already exists' do
      before { activity_pack_sequence }

      it { expect { subject }.to change(ActivityPackSequence, :count).from(1).to(0) }

      context 'Activity Pack Sequence Activity Packs exist' do
        before { create(:activity_pack_sequence_activity_pack, activity_pack_sequence: activity_pack_sequence) }

        it { expect { subject }.to change(ActivityPackSequenceActivityPack, :count).from(1).to(0) }
      end
    end
  end
end
