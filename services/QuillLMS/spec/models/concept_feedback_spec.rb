require 'rails_helper'

RSpec.describe ConceptFeedback, type: :model do
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

    it 'should be invalid if data is not a hash' do
      concept_feedback.data = 1
      expect(concept_feedback.valid?).to be false
      expect(concept_feedback.errors[:data]).to include('must be a hash')
    end
  end

  describe '#as_json' do
    it 'should just be the data attribute' do
      expect(concept_feedback.as_json).to eq(concept_feedback.data)
    end
  end
end
