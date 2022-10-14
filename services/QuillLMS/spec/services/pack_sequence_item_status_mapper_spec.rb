# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PackSequenceItemStatusMapper do
  subject { described_class.run(results) }

  let(:locked) { described_class::LOCKED }
  let(:unlocked) { described_class::UNLOCKED }

  let(:result1) { result(finished1, pack_sequence_item_id1, pack_sequence_item_order1) }
  let(:result2) { result(finished2, pack_sequence_item_id2, pack_sequence_item_order2) }

  let(:pack_sequence_item_order1) { rand(10) }
  let(:pack_sequence_item_order2) { pack_sequence_item_order1 + 1 }

  context 'no results' do
    let(:results) { [] }

    it { expect(subject).to eq({}) }
  end

  context 'one pack_sequence_item with one result' do
    let(:results) { [result1] }
    let(:pack_sequence_item_id1) { 1 }

    context 'results are finished' do
      let(:finished1) { true }

      it { expect(subject).to eq(pack_sequence_item_id1 => unlocked) }
    end

    context 'results are unfinished' do
      let(:finished1) { false }

      it { expect(subject).to eq(pack_sequence_item_id1 => unlocked) }
    end
  end

  context 'one pack_sequence_item with two results' do
    let(:results) { [result1, result2] }
    let(:pack_sequence_item_id1) { 1 }
    let(:pack_sequence_item_id2) { pack_sequence_item_id1 }

    context 'results are unfinished, finished' do
      let(:finished1) { false }
      let(:finished2) { true }

      it do
        expect(subject).to eq(
          pack_sequence_item_id1 => unlocked,
          pack_sequence_item_id2 => unlocked
        )
      end
    end

    context 'results are unfinished, unfinished' do
      let(:finished1) { false }
      let(:finished2) { false }

      it do
        expect(subject).to eq(
          pack_sequence_item_id1 => unlocked,
          pack_sequence_item_id2 => unlocked
        )
      end
    end
  end

  context 'two pack_sequences_items with one result each' do
    let(:results) { [result1, result2] }
    let(:pack_sequence_item_id1) { 1 }
    let(:pack_sequence_item_id2) { 2 }

    context 'results are unfinished, finished' do
      let(:finished1) { false }
      let(:finished2) { true }

      it do
        expect(subject).to eq(
          pack_sequence_item_id1 => unlocked,
          pack_sequence_item_id2 => locked
        )
      end
    end

    context 'results are unfinished, unfinished' do
      let(:finished1) { false }
      let(:finished2) { false }

      it do
        expect(subject).to eq(
          pack_sequence_item_id1 => unlocked,
          pack_sequence_item_id2 => locked
        )
      end
    end

    context 'with order reversed' do
      let(:pack_sequence_item_order1) { rand(10) }
      let(:pack_sequence_item_order2) { pack_sequence_item_order1 - 1 }

      context 'results are unfinished, finished' do
        let(:finished1) { false }
        let(:finished2) { true }

        it do
          expect(subject).to eq(
            pack_sequence_item_id2 => unlocked,
            pack_sequence_item_id1 => unlocked
          )
        end
      end

      context 'results are finished, unfinished' do
        let(:finished1) { true }
        let(:finished2) { false }

        it do
          expect(subject).to eq(
            pack_sequence_item_id2 => unlocked,
            pack_sequence_item_id1 => locked
          )
        end
      end
    end
  end

  context 'two pack_sequence_items, one with two results and the other with one result' do
    let(:result3) { result(finished3, pack_sequence_item_id3, pack_sequence_item_order3) }
    let(:pack_sequence_item_order2) { pack_sequence_item_order1 }
    let(:pack_sequence_item_order3) { pack_sequence_item_order2 + 1 }

    let(:results) { [result1, result2, result3] }
    let(:pack_sequence_item_id1) { 1 }
    let(:pack_sequence_item_id2) { pack_sequence_item_id1 }
    let(:pack_sequence_item_id3) { 2 }

    context 'results are unfinished, finished, finished' do
      let(:finished1) { false }
      let(:finished2) { true }
      let(:finished3) { true }

      it do
        expect(subject).to eq(
          pack_sequence_item_id1 => unlocked,
          pack_sequence_item_id2 => unlocked,
          pack_sequence_item_id3 => locked
        )
      end
    end
  end

  def result(finished, pack_sequence_item_id, pack_sequence_item_order)
    {
      ActivitySession::STATE_FINISHED_KEY => finished,
      PackSequenceItem::ID_KEY => pack_sequence_item_id,
      PackSequenceItem::ORDER_KEY => pack_sequence_item_order,
    }
  end
end
