# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PackSequenceItemStatusMapper do
  subject { described_class.run(results) }

  let(:staggered) { PackSequence::STAGGERED_RELEASE }

  let(:result1) do
    {
      "name" => "Some name 1",
      "release_method" => release_method1,
      "pack_sequence_id" => pack_sequence1_id
    }
  end

  let(:result2) do
    {
      "name" => "Some name 1",
      "release_method" => release_method2,
      "pack_sequence_id" => pack_sequence2_id
    }
  end

  context 'results is empty' do
    let(:results) { [] }

    it { expect(subject).to eq({}) }
  end

  context 'results contains a result with no activity_pack_id' do
    let(:results) { [result1] }
    let(:pack_sequence1_id) { nil }
    let(:release_method1) { staggered }

    it { expect(subject).to eq({}) }
  end

  context 'results contains a result with activity_pack_id' do
    let(:results) { [result1] }
    let(:pack_sequence1_id) { create(:pack_sequence).id }

    context 'release method is not staggered' do
      let(:release_method1) { nil }

      it { expect(subject).to eq({}) }
    end

    context 'release method is staggered' do
      let(:release_method1) { staggered }

      it { expect(subject).to eq(pack_sequence1_id => [result1]) }
    end
  end

  context 'results contains two results with same activity_pack_ids' do
    let(:results) { [result1, result2] }
    let(:pack_sequence1_id) { create(:pack_sequence).id }
    let(:pack_sequence2_id) { pack_sequence1_id }
    let(:release_method1) { staggered }
    let(:release_method2) { staggered }

    it { expect(subject).to eq(pack_sequence1_id => [result1, result2]) }
  end

  context 'results contains two results with different activity_pack_ids' do
    let(:results) { [result1, result2] }
    let(:pack_sequence1_id) { create(:pack_sequence).id }
    let(:pack_sequence2_id) { create(:pack_sequence).id }
    let(:release_method1) { staggered }
    let(:release_method2) { staggered }

    it do
      expect(subject).to eq(
        pack_sequence1_id => [result1],
        pack_sequence2_id => [result2]
      )
    end
  end
end
