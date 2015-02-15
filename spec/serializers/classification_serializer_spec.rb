require 'rails_helper'

describe ClassificationSerializer, type: :serializer do
  let(:classification) { FactoryGirl.create(:classification) }
  let(:serializer)     { ClassificationSerializer.new(classification) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    classification_key = 'classification'

    it "includes '#{classification_key}' key" do
      expect(parsed.keys).to include(classification_key)
    end

    describe "'#{classification_key}' object" do
      let(:parsed_classification) { parsed[classification_key] }

      it 'has the correct keys' do
        expect(parsed_classification.keys)
          .to match_array %w(alias
                             created_at
                             form_url
                             id
                             image_class
                             key
                             module_url
                             name
                             scorebook_icon_class
                             uid
                             updated_at)
      end
    end
  end
end
