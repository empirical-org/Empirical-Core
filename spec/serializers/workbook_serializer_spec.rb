require 'spec_helper'

describe WorkbookSerializer, type: :serializer do
  let!(:workbook) { FactoryGirl.create(:workbook) }
  let!(:serializer) { WorkbookSerializer.new(workbook) }


  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('workbook')
    end

    context "workbook object" do
      let!(:workbook_json) { parsed['workbook'] }

      it "should have these keys" do
        expected = ["id", "title", "created_at", "updated_at"]
        expect(workbook_json.keys).to match_array(expected)
      end


    end

  end
end
