require 'rails_helper'

describe WorkbookSerializer, type: :serializer do
  let(:workbook)   { FactoryGirl.create(:workbook) }
  let(:serializer) { WorkbookSerializer.new(workbook) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    workbook_key = 'workbook'

    it "includes '#{workbook_key}' key" do
      expect(parsed.keys).to include(workbook_key)
    end

    describe "'#{workbook_key}' object" do
      let(:parsed_workbook) { parsed[workbook_key] }

      it 'has the correct keys' do
        expect(parsed_workbook.keys).to match_array %w(created_at
                                                       id
                                                       title
                                                       updated_at)
      end
    end
  end
end
