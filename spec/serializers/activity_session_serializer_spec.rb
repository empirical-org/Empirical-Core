require 'spec_helper'

describe ActivitySessionSerializer, type: :serializer do

  let!(:activity_session) { FactoryGirl.create(:activity_session) }
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
                    "activity_uid", "anonymous", "access_token"]
        expect(activity_session_json.keys).to eq(expected)
      end


    end

  end

end
