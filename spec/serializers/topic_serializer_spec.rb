require 'spec_helper'

describe TopicSerializer, type: :serializer do
  let!(:topic) { FactoryGirl.create(:topic) }
  let!(:serializer) { TopicSerializer.new(topic) }


  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('topic')
    end

    context "topic object" do
      let!(:topic_json) { parsed['topic'] }

      it "should have these keys" do
        expected = ["id", "name", "created_at", "updated_at", "section", "topic_category"]
        expect(topic_json.keys).to eq(expected)
      end

      it "should include a section" do
        expect(topic_json['section'].class).to eq(Hash)
      end

    end

  end
end
