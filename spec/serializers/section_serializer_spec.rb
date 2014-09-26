require 'spec_helper'

describe SectionSerializer, type: :serializer do
  let!(:section) { FactoryGirl.create(:section) }
  let!(:serializer) { SectionSerializer.new(section) }


  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('section')
    end

    context "section object" do
      let!(:section_json) { parsed['section'] }

      it "should have these keys" do
        expected = ["id", "name", "created_at", "updated_at", "workbook"]
        expect(section_json.keys).to eq(expected)
      end

      it "should include a workbook" do
        expect(section_json['workbook'].class).to eq(Hash)
      end

    end
  end
end
