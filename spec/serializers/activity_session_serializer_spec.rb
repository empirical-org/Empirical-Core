require 'spec_helper'

describe ActivitySessionSerializer, type: :serializer do

  let!(:concept_class) { FactoryGirl.create(:concept_class) }
  let!(:concept_tag) { FactoryGirl.create(:concept_tag, concept_class: concept_class) }
  let!(:concept_tag_result) { FactoryGirl.create(:concept_tag_result, metadata: {"foo" => "bar"}, concept_tag: concept_tag) }
  let!(:activity_session) { FactoryGirl.create(:activity_session, concept_tag_results: [concept_tag_result]) }
  let!(:serializer) { ActivitySessionSerializer.new(activity_session) }

  context "has expected attributes" do

    let!(:parsed) { JSON.parse(serializer.to_json) }

    it "should contain a root attribute" do
      expect(parsed.keys).to include('activity_session')
    end

    context "activity_session object" do
      let!(:activity_session_json) { parsed['activity_session'] }

      it "should have these keys" do
        expected = ["uid", "percentage", "time_spent", "state", "completed_at", "data", "temporary", 
                    "activity_uid", "anonymous", "concept_tag_results"]
        expect(activity_session_json.keys).to eq(expected)
      end

      it "should have a properly formatted concept tags response" do
        expected = [
          {
            "concept_tag" => concept_tag.name,
            "foo" => "bar"
          }
        ]
        expect(activity_session_json["concept_tag_results"]).to eq(expected)
      end

    end

  end

end
