require 'spec_helper'

describe ClassificationSerializer, type: :serializer do
  let!(:classification) { FactoryGirl.create(:classification) }
  let!(:serializer) { ClassificationSerializer.new(classification) }


  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('classification')
    end

    context "classification object" do
      let!(:classification_json) { parsed['classification'] }

      it "should have these keys" do
        expected = ["uid", "name", "key", "form_url", "module_url", "created_at", "updated_at"]
        expect(classification_json.keys).to eq(expected)
      end


    end

  end
end
