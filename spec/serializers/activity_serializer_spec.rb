require 'spec_helper'

describe ActivitySerializer, type: :serializer do

  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:serializer) { ActivitySerializer.new(activity) }


  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('activity')
    end

    context "activity object" do
      let!(:activity_json) { parsed['activity'] }

      it "should have these keys" do
        expected = ["uid", "id", "name", "description", "flags", "data", "created_at", "updated_at", "anonymous_path", "classification", "topic"]
        expect(activity_json.keys).to match_array(expected)
      end

      it "should include a topic" do
        expect(activity_json['topic'].class).to eq(Hash)
      end

    end

  end

end
