require 'rails_helper'

describe StandardSerializer, type: :serializer do
  let(:standard)      { create(:standard) }
  let(:serializer) { StandardSerializer.new(standard) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    standard_key = 'standard'

    it "includes '#{standard_key}' key" do
      expect(parsed.keys).to include(standard_key)
    end

    describe "'#{standard_key}' object" do
      let(:parsed_standard) { parsed[standard_key] }

      standard_level_key = 'standard_level'

      it 'has the correct keys' do
        expect(parsed_standard.keys)
          .to match_array %w(id
                             created_at
                             name) +
                            [standard_level_key] +
                          %w(standard_category
                             updated_at)
      end

      it "includes a '#{standard_level_key}' Hash" do
        expect(parsed_standard[standard_level_key]).to be_a(Hash)
      end
    end
  end
end
