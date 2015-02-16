require 'rails_helper'

describe ActivitySerializer, type: :serializer do
  let(:activity)   { FactoryGirl.create(:activity) }
  let(:serializer) { ActivitySerializer.new(activity) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    activity_key = 'activity'

    it "includes '#{activity_key}' key" do
      expect(parsed.keys).to include(activity_key)
    end

    describe "'#{activity_key}' object" do
      let(:parsed_activity) { parsed[activity_key] }

      topic_key = 'topic'

      it "has the correct keys" do
        expect(parsed_activity.keys)
          .to match_array %w(anonymous_path
                             classification
                             created_at
                             data
                             description
                             flags
                             id
                             name) +
                            [topic_key] +
                          %w(uid
                             updated_at)
      end

      it "includes '#{topic_key}' Hash" do
        expect(parsed_activity[topic_key]).to be_a(Hash)
      end
    end
  end
end
