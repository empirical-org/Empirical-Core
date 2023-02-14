# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserPackSequenceItemSaver do
  subject { described_class.run(classroom_id, user_id) }

  let(:worker_class) { SaveUserPackSequenceItemWorker }

  let(:classroom_id) { create(:classroom).id }
  let(:user_id) { create(:student).id }

  let(:pack_sequence1) { create(:pack_sequence) }
  let(:pack_sequence_item1) { create(:pack_sequence_item, pack_sequence: pack_sequence1) }
  let(:pack_sequence_item2) { create(:pack_sequence_item, pack_sequence: pack_sequence1) }

  let(:locked) { described_class::LOCKED }
  let(:unlocked) { described_class::UNLOCKED }

  before { allow(UserPackSequenceItemQuery).to receive(:call).with(classroom_id, user_id).and_return(results) }

  after { worker_class.clear }

  context 'no completed results' do
    let(:results) { [] }
    let(:expected_job_args) { [] }

    it { should_enqueue_workers }
  end

  context 'one pack_sequence_item with one result' do
    let(:result1) { result(completed1, pack_sequence_item1) }
    let(:results) { [result1] }

    context 'result is completed' do
      let(:completed1) { true }
      let(:expected_job_args) { [[pack_sequence_item1.id, unlocked, user_id]] }

      it { should_enqueue_workers }
    end

    context 'result is uncompleted' do
      let(:completed1) { false }
      let(:expected_job_args) { [[pack_sequence_item1.id, unlocked, user_id]] }

      it { should_enqueue_workers }
    end
  end

  context 'one pack_sequence_item with two results' do
    let(:result1) { result(completed1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence_item1) }
    let(:results) { [result1, result2] }

    context 'results are completed, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:expected_job_args) { [[pack_sequence_item1.id, unlocked, user_id]] }

      it { should_enqueue_workers }
    end

    context 'results are uncompleted, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { false }
      let(:expected_job_args) { [[pack_sequence_item1.id, unlocked, user_id]] }

      it { should_enqueue_workers }
    end
  end

  context 'two pack_sequences_items with one result each' do
    let(:result1) { result(completed1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence_item2) }
    let(:results) { [result1, result2] }

    context 'results are uncompleted, completed' do
      let(:completed1) { false }
      let(:completed2) { true }

      let(:expected_job_args) do
        [
          [pack_sequence_item1.id, unlocked, user_id],
          [pack_sequence_item2.id, locked, user_id]
        ]
      end

      it { should_enqueue_workers }
    end

    context 'results are uncompleted, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { false }

      let(:expected_job_args) do
        [
          [pack_sequence_item1.id, unlocked, user_id],
          [pack_sequence_item2.id, locked, user_id]
        ]
      end

      it { should_enqueue_workers }
    end
  end

  context 'two pack_sequence_items, one with two results and the other with one result' do
    let(:result1) { result(completed1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence_item1) }
    let(:result3) { result(completed3, pack_sequence_item2) }
    let(:results) { [result1, result2, result3] }

    context 'results are uncompleted, completed, completed' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { true }

      let(:expected_job_args) do
        [
          [pack_sequence_item1.id, unlocked, user_id],
          [pack_sequence_item2.id, locked, user_id]
        ]
      end

      it { should_enqueue_workers }
    end
  end

  context 'two pack_sequences' do
    let(:pack_sequence2) { create(:pack_sequence) }
    let(:pack_sequence_item3) { create(:pack_sequence_item, pack_sequence: pack_sequence2) }
    let(:pack_sequence_item4) { create(:pack_sequence_item, pack_sequence: pack_sequence2) }

    let(:result1) { result(completed1, pack_sequence_item1) }
    let(:result2) { result(completed2, pack_sequence_item2) }
    let(:result3) { result(completed3, pack_sequence_item3) }
    let(:result4) { result(completed3, pack_sequence_item4) }
    let(:results) { [result1, result2, result3, result4] }

    context 'results are uncompleted, completed, completed, uncompleted' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { true }
      let(:completed4) { false }

      let(:expected_job_args) do
        [
          [pack_sequence_item1.id, unlocked, user_id],
          [pack_sequence_item2.id, locked, user_id],
          [pack_sequence_item3.id, unlocked, user_id],
          [pack_sequence_item4.id, unlocked, user_id]
        ]
      end

      it { should_enqueue_workers }
    end

    context 'results are uncompleted, completed, uncompleted, completed' do
      let(:completed1) { false }
      let(:completed2) { true }
      let(:completed3) { false }
      let(:completed4) { true }

      let(:expected_job_args) do
        [
          [pack_sequence_item1.id, unlocked, user_id],
          [pack_sequence_item2.id, locked, user_id],
          [pack_sequence_item3.id, unlocked, user_id],
          [pack_sequence_item4.id, locked, user_id]
        ]
      end

      it { should_enqueue_workers }
    end
  end

  def result(completed, pack_sequence_item)
    {
      described_class::COMPLETED_KEY => completed,
      described_class::PACK_SEQUENCE_ID_KEY => pack_sequence_item.pack_sequence.id,
      described_class::PACK_SEQUENCE_ITEM_ID_KEY => pack_sequence_item.id
    }
  end

  def should_enqueue_workers
    subject
    expect(worker_class.jobs.map { |job| job["args"] }).to eq expected_job_args
  end
end

