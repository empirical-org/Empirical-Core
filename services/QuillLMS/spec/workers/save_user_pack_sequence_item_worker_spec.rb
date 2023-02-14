# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SaveUserPackSequenceItemWorker do
  subject { described_class.new.perform(pack_sequence_item_id, status, user_id) }

  let(:pack_sequence_item_id) { create(:pack_sequence_item).id }
  let(:user_id) { create(:user).id }
  let(:locked) { UserPackSequenceItem::LOCKED }
  let(:unlocked) { UserPackSequenceItem::UNLOCKED }
  let(:status) { [locked, unlocked].sample }

  context 'nil pack_sequence_id' do
    let(:pack_sequence_item_id) { nil }

    it 'should_not_query_user_pack_sequence_item' do
      expect(UserPackSequenceItem).not_to receive(:create_or_find_by!)
      subject
    end
  end

  context 'nil user_id' do
    let(:user_id) { nil }

    it 'should_not_query_user_pack_sequence_item' do
      expect(UserPackSequenceItem).not_to receive(:create_or_find_by!)
      subject
    end
  end

  context 'user_pack_sequence_item does not exist' do
    it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(1) }
  end

  context 'user_pack_sequence_item exists' do
    let!(:user_pack_sequence_item) do
      create(:user_pack_sequence_item,
        pack_sequence_item_id: pack_sequence_item_id,
        status: locked,
        user_id: user_id
      )
    end

    context 'status does not change' do
      let(:status) { locked }

      it { expect { subject }.not_to change(UserPackSequenceItem, :count) }
      it { expect { subject }.not_to change { user_pack_sequence_item.reload.status } }
    end

    context 'status does change' do
      let(:status) { unlocked }

      it { expect { subject }.not_to change(UserPackSequenceItem, :count) }
      it { expect { subject }.to change { user_pack_sequence_item.reload.status } }
    end
  end
end
