require 'rails_helper'

describe TopicSerializer, type: :serializer do
  let(:topic)      { FactoryGirl.create(:topic) }
  let(:serializer) { TopicSerializer.new(topic) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    topic_key = 'topic'

    it "includes '#{topic_key}' key" do
      expect(parsed.keys).to include(topic_key)
    end

    describe "'#{topic_key}' object" do
      let(:parsed_topic) { parsed[topic_key] }

      section_key = 'section'

      it 'has the correct keys' do
        expect(parsed_topic.keys)
          .to match_array %w(id
                             created_at
                             name) +
                            [section_key] +
                          %w(topic_category
                             updated_at)
      end

      it "includes a '#{section_key}' Hash" do
        expect(parsed_topic[section_key]).to be_a(Hash)
      end
    end
  end
end
