require 'rails_helper'

describe ActivityClassification, type: :model, redis: true do
  it { should have_many(:activities) }
  it { should have_many(:concept_results) }
  it { should validate_presence_of(:key) }

  it_behaves_like "uid"
  
  describe 'unique key' do
    #We are creating an activity classification 
    #here because validate_uniqueness_of requires 
    #an existing activity_classification to work properly.
    subject { create(:activity_classification) }
    it { should validate_uniqueness_of(:key) }
  end

  let(:activity_classification) { build(:activity_classification) }

  describe 'diagnostic' do
    context 'when it exists' do
      let!(:activity_classification) { create(:diagnostic) }

      it 'should find the activity_classification with diagnostic key' do
        expect(ActivityClassification.diagnostic).to eq(activity_classification)
      end
    end

    context 'when it does not exist' do
      it 'should return nil' do
        expect(ActivityClassification.diagnostic).to eq(nil)
      end
    end
  end

end
