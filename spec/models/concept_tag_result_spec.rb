require 'rails_helper'

describe ConceptTagResult, :type => :model do

  let(:concept_tag_result) { FactoryGirl.build(:concept_tag_result, concept_tag: nil, concept_category: nil) }
  let!(:concept_tag) { FactoryGirl.create(:concept_tag, concept_class: concept_class) }
  let!(:concept_class) { FactoryGirl.create(:concept_class) }
  let!(:concept_category) { FactoryGirl.create(:concept_category, concept_class: concept_class) }

  describe "converting string concept tag/class names into foreign keys" do
    before do
      concept_tag_result.metadata = incoming_metadata
    end

    subject { concept_tag_result.valid? }

    context "when all fields are set properly in the JSON" do
      let(:incoming_metadata) { {
          "concept_class" => concept_class.name,
          "concept_tag" => concept_tag.name,
          "concept_category" => concept_category.name,
          "foo" => "bar"
      } }

      it "should strip out concept tags/class names" do
        subject
        expect(concept_tag_result.metadata).to match({"foo" => "bar"})
      end

      it "should set the concept_id on the model" do
        subject
        expect(concept_tag_result.concept_tag_id).to eq(concept_tag.id)
      end

      it "should be valid" do
        subject
        expect(concept_tag_result).to be_valid
      end
    end

    context "when any required fields are missing" do
      let(:incoming_metadata) { {
          "concept_category" => concept_category.name,
          "foo" => "bar"
      } }

      it "should be invalid" do
        expect(concept_tag_result).to_not be_valid
      end
    end

    context "when concept tag does not exist" do
      let(:incoming_metadata) { {
        "concept_class" => concept_class.name,
        "concept_tag" => "foobar nonexistent name",
        "concept_category" => concept_category.name,
        "foo" => "bar"
      } }

      it "should be invalid" do
        subject
        expect(concept_tag_result).to_not be_valid
      end
    end

    context "when concept class does not exist" do
      let(:incoming_metadata) { {
        "concept_class" => "foobar nonexistent name",
        "concept_tag" => concept_tag.name,
        "concept_category" => concept_category.name,
        "foo" => "bar"
      } }

      it "should be invalid" do
        subject
        expect(concept_tag_result).to_not be_valid
      end
    end

    context "when concept category does not exist" do
      let(:incoming_metadata) { {
        "concept_class" => concept_class.name,
        "concept_tag" => concept_tag.name,
        "concept_category" => "foobar nonexistent name",
        "foo" => "bar"
      } }

      it "should be invalid" do
        subject
        expect(concept_tag_result).to_not be_valid
      end
    end
  end
end