# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_feedbacks
#
#  id            :integer          not null, primary key
#  activity_type :string           not null
#  data          :jsonb
#  uid           :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_concept_feedbacks_on_activity_type          (activity_type)
#  index_concept_feedbacks_on_uid_and_activity_type  (uid,activity_type) UNIQUE
#
require 'rails_helper'

RSpec.describe ConceptFeedback, type: :model do
  it { expect(ConceptFeedback.ancestors).to include(Translatable) }

  let(:concept_feedback) { create(:concept_feedback) }

  describe '#valid?' do
    it 'should be valid from the factory' do
      expect(concept_feedback.valid?).to be true
    end

    it 'should be invalid without a uid' do
      concept_feedback.uid = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid without data' do
      concept_feedback.data = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid without activity_type' do
      concept_feedback.activity_type = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid if activity_type is not an allowed value' do
      concept_feedback.activity_type = 'some_totally_invalid_type'
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid if data is not a hash' do
      concept_feedback.data = 1
      expect(concept_feedback.valid?).to be false
      expect(concept_feedback.errors[:data]).to include('must be a hash')
    end
  end

  describe '#as_json' do
    let(:concept_feedback) { create(:concept_feedback, data: { "description" => "Test description" }) }
    let(:options) { { source_api: "test_api" } }

    it 'delegates to the translated_json method from Translatable concern' do
      expect(concept_feedback).to receive(:translated_json).with(options)
      concept_feedback.as_json(options)
    end
  end

  describe '#callbacks' do
    let!(:concept_feedback) { create(:concept_feedback) }

    context 'after update' do
      it 'calls redis cache delete on concept feedback with activity type' do
        expect($redis).to receive(:del).with(concept_feedback.cache_key)
        concept_feedback.update(data: {test: 'test'})
      end
    end

    context 'after create' do
      it 'calls redis cache delete on concept feedback with activity type' do
        activity_type = "grammar"
        expect($redis).to receive(:del).with("#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{activity_type}")
        ConceptFeedback.create(activity_type: activity_type, data: {test: 'test'}, uid: SecureRandom.uuid)
      end
    end
  end

end
