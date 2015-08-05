require 'rails_helper'

describe ConceptResult, :type => :model do

  let(:concept_result) { FactoryGirl.build(:concept_result, concept: nil) }
  let!(:concept) { FactoryGirl.create(:concept) }

  describe "converting string concept tag/class names into foreign keys" do
    before do
      concept_result.metadata = incoming_metadata
    end

    subject { concept_result.valid? }

    context "when all fields are set properly in the JSON" do
      let(:incoming_metadata) do
        {
          "concept" => concept.uid,
          "foo" => "bar"
        }
      end

      it "should strip out concept uid" do
        subject
        expect(concept_result.metadata).to match({"foo" => "bar"})
      end

      it "should set the concept_id on the model" do
        subject
        expect(concept_result.concept_id).to eq(concept.id)
      end

      it "should be valid" do
        subject
        expect(concept_result).to be_valid
      end
    end

    context "when any required fields are missing" do
      let(:incoming_metadata) do
        {
          "foo" => "bar"
        } 
      end

      it "should be invalid" do
        expect(concept_result).to_not be_valid
      end
    end

    context "when concept tag does not exist" do
      let(:incoming_metadata) do 
        {
          "concept" => "foobar non-existent uid",
          "foo" => "bar"
        } 
      end

      it "should be invalid" do
        subject
        expect(concept_result).to_not be_valid
      end
    end
  end
end