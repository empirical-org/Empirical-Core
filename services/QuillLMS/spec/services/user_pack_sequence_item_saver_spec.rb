# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPackSequenceItemSaver do
  subject { described_class.run(classroom.id, user.id) }

  let(:classroom) { create(:classroom) }
  let(:user) { create(:student) }

  let(:pack_sequence1) { create(:pack_sequence) }
  let(:pack_sequence_item1) { create(:pack_sequence_item, pack_sequence: pack_sequence1) }
  let(:pack_sequence_item2) { create(:pack_sequence_item, pack_sequence: pack_sequence1) }

  let(:locked) { described_class::LOCKED }
  let(:unlocked) { described_class::UNLOCKED }

  before { allow(UserPackSequenceItemQuery).to receive(:call).with(classroom.id, user.id).and_return(results) }

  context 'no completed results' do
    let(:results) { [] }

    it { expect { subject }.not_to change(UserPackSequenceItem, :count).from(0) }
  end

  context 'one pack_sequence_item with one result' do
    let(:result1) { result(completed1, pack_sequence1, pack_sequence_item1) }
    let(:results) { [result1] }

    context 'result is completed' do
      let(:completed1) { true }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(1) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
    end

    context 'result is uncompleted' do
      let(:completed1) { false }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(1) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
    end
  end

  context 'one pack_sequence_item with two results' do
    let(:result1) { result(completed1, pack_sequence1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence1, pack_sequence_item1) }
    let(:results) { [result1, result2] }

    context 'results are completed, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { true }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(1) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
    end

    context 'results are uncompleted, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { false }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(1) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
    end
  end

  context 'two pack_sequences_items with one result each' do
    let(:result1) { result(completed1, pack_sequence1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence1, pack_sequence_item2) }
    let(:results) { [result1, result2] }

    context 'results are uncompleted, completed' do
      let(:completed1) { false }
      let(:completed2) { true }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(2) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item2, locked) }
    end

    context 'results are uncompleted, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { false }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(2) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item2, locked) }
    end
  end

  context 'two pack_sequence_items, one with two results and the other with one result' do
    let(:result1) { result(completed1, pack_sequence1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence1, pack_sequence_item1) }
    let(:result3) { result(completed3, pack_sequence1, pack_sequence_item2) }
    let(:results) { [result1, result2, result3] }

    context 'results are uncompleted, completed, completed' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { true }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(2) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item2, locked) }
    end
  end

  context 'two pack_sequences' do
    let(:pack_sequence2) { create(:pack_sequence) }
    let(:pack_sequence_item3) { create(:pack_sequence_item, pack_sequence: pack_sequence2) }
    let(:pack_sequence_item4) { create(:pack_sequence_item, pack_sequence: pack_sequence2) }

    let(:result1) { result(completed1, pack_sequence1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence1, pack_sequence_item2) }
    let(:result3) { result(completed3, pack_sequence2, pack_sequence_item3) }
    let(:result4) { result(completed3, pack_sequence2, pack_sequence_item4) }
    let(:results) { [result1, result2, result3, result4] }

    context 'results are uncompleted, completed, completed, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { true }
      let(:completed4) { false }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(4) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item2, locked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item3, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item4, unlocked) }
    end

    context 'results are uncompleted, completed, uncompleted, completed' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { false }
      let(:completed4) { true }

      it { expect { subject }.to change(UserPackSequenceItem, :count).from(0).to(4) }
      it { should_save_user_pack_sequence_item(pack_sequence_item1, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item2, locked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item3, unlocked) }
      it { should_save_user_pack_sequence_item(pack_sequence_item4, locked) }
    end
  end


  def result(completed, pack_sequence, pack_sequence_item)
    {
      described_class::COMPLETED_KEY => completed,
      described_class::PACK_SEQUENCE_ID_KEY => pack_sequence.id,
      described_class::PACK_SEQUENCE_ITEM_ID_KEY => pack_sequence_item.id
    }
  end

  def should_save_user_pack_sequence_item(pack_sequence_item, status)
    subject
    expect(pack_sequence_item.user_pack_sequence_items.exists?(status: status, user: user)).to be true
  end
end

