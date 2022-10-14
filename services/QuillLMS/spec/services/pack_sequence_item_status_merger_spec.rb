# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PackSequenceItemStatusMerger do
  subject { described_class.run(classroom_user_profile) }

  let(:staggered) { PackSequence::STAGGERED_RELEASE }

  let(:profile_result1) do
    {
      "name" => "Some name 1",
      "release_method" => release_method1,
      "activity_pack_sequence_id" => activity_pack_sequence1_id
    }
  end

  let(:profile_result2) do
    {
      "name" => "Some name 1",
      "release_method" => release_method2,
      "activity_pack_sequence_id" => activity_pack_sequence2_id
    }
  end

  context 'profile is empty' do
    let(:classroom_user_profile) { [] }

    it { expect(subject).to eq({}) }
  end

  context 'profile contains a result with no activity_pack_id' do
    let(:classroom_user_profile) { [profile_result1] }
    let(:activity_pack_sequence1_id) { nil }
    let(:release_method1) { staggered }

    it { expect(subject).to eq({}) }
  end

  context 'profile contains a result with activity_pack_id' do
    let(:classroom_user_profile) { [profile_result1] }
    let(:activity_pack_sequence1_id) { create(:activity_pack_sequence).id }

    context 'release method is not staggered' do
      let(:release_method1) { nil }

      it { expect(subject).to eq({}) }
    end

    context 'release method is staggered' do
      let(:release_method1) { staggered }

      it { expect(subject).to eq(activity_pack_sequence1_id => [profile_result1]) }
    end
  end

  context 'profile contains two results with same activity_pack_ids' do
    let(:classroom_user_profile) { [profile_result1, profile_result2] }
    let(:activity_pack_sequence1_id) { create(:activity_pack_sequence).id }
    let(:activity_pack_sequence2_id) { activity_pack_sequence1_id }
    let(:release_method1) { staggered }
    let(:release_method2) { staggered }

    it { expect(subject).to eq(activity_pack_sequence1_id => [profile_result1, profile_result2]) }
  end

  context 'profile contains two results with different activity_pack_ids' do
    let(:classroom_user_profile) { [profile_result1, profile_result2] }
    let(:activity_pack_sequence1_id) { create(:activity_pack_sequence).id }
    let(:activity_pack_sequence2_id) { create(:activity_pack_sequence).id }
    let(:release_method1) { staggered }
    let(:release_method2) { staggered }

    it do
      expect(subject).to eq(
        activity_pack_sequence1_id => [profile_result1],
        activity_pack_sequence2_id => [profile_result2]
      )
    end
  end
end
