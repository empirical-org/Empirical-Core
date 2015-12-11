require 'rails_helper'

describe ConceptResult, type: :model do

  let(:concept_result) { FactoryGirl.build(:concept_result, concept: nil) }
  let!(:concept) { FactoryGirl.create(:concept) }

  describe '#concept_uid=' do
    it 'assigns the concept with that UID' do
      concept_result.concept_uid = concept.uid
      expect(concept_result.concept).to eq(concept)
    end
  end

end