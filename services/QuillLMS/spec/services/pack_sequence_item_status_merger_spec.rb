# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PackSequenceItemStatusMerger do
  subject { described_class.run(results) }

  let(:staggered) { PackSequence::STAGGERED_RELEASE }

  let(:locked) { PackSequenceItem::LOCKED}
  let(:no_lock) { PackSequenceItem::NO_LOCK }
  let(:unlocked) { PackSequenceItem::UNLOCKED }
  let(:status_key) { PackSequenceItem::STATUS_KEY }

  let(:result1) { result(true, pack_sequence_id1, release_method1, pack_sequence_item_id1, 1) }
  let(:result2) { result(false, pack_sequence_id2, release_method2, pack_sequence_item_id2, 2) }
  let(:result3) { result(true, pack_sequence_id3, release_method3, pack_sequence_item_id3, 3) }

  context 'results is empty' do
    let(:results) { [] }

    it { expect(subject).to eq([]) }
  end

  context 'result contains a nil release_method1' do
    let(:results) { [result1] }
    let(:release_method1) { nil }
    let(:pack_sequence_id1) { nil }
    let(:pack_sequence_item_id1) { nil }

    it { expect(subject).to eq([result1.merge(status_key => no_lock)]) }
  end

  context 'result contains a staggered release' do
    let(:results) { [result1] }
    let(:release_method1) { staggered }

    context 'with a nil pack_sequence_id' do
      let(:pack_sequence_id1) { nil }
      let(:pack_sequence_item_id1) { nil }

      it { expect(subject).to eq([result1.merge(status_key => no_lock)]) }
    end

    context 'with a pack_sequence_id' do
      let(:pack_sequence_id1) { 1 }

      context 'and a finished pack_sequence_item' do
        let(:pack_sequence_item_id1) { 1 }

        it { expect(subject).to eq([result1.merge(status_key => unlocked)]) }
      end
    end
  end

  context 'results contains two results with same pack_sequence but different pack_sequence_item' do
    let(:results) { [result2, result3] }
    let(:pack_sequence_id2) { 2 }
    let(:pack_sequence_id3) { pack_sequence_id2 }
    let(:pack_sequence_item_id2) { 2 }
    let(:pack_sequence_item_id3) { pack_sequence_id2 + 1 }
    let(:release_method2) { staggered }
    let(:release_method3) { staggered }

    it { expect(subject).to eq([result2.merge(status_key => unlocked), result3.merge(status_key => locked)]) }
  end

  def result(finished, pack_sequence_id, pack_sequence_release_method, pack_sequence_item_id, pack_sequence_item_order)
    {
      ActivitySession::STATE_FINISHED_KEY => finished,
      PackSequence::ID_KEY => pack_sequence_id,
      PackSequence::RELEASE_METHOD_KEY => pack_sequence_release_method,
      PackSequenceItem::ID_KEY => pack_sequence_item_id,
      PackSequenceItem::ORDER_KEY => pack_sequence_item_order,
    }
  end
end
