require 'rails_helper'

describe TeacherActivityFeed, type: :model do
  describe "redis feed model without callback" do

    let(:activity_session) {create(:activity_session, percentage: 0.90, completed_at: 5.minutes.ago)}
    let(:activity_session2) {create(:activity_session, percentage: 0.66, completed_at: 2.minutes.ago)}

    context "Storing and retrieving a session" do
      it 'should add and return activity sessions by order completed DESC' do
        TeacherActivityFeed.new(1).send(:delete_all)
        TeacherActivityFeed.add(1, activity_session.id)
        TeacherActivityFeed.add(1, activity_session2.id)

        feed = TeacherActivityFeed.get(1)

        expect(feed.class).to eq(Array)
        expect(feed.size).to eq(2)

        expect(feed.first[:id]).to eq(activity_session2.id)
        expect(feed.first[:completed]).to eq("2 mins ago")
        expect(feed.first[:score]).to eq("Nearly proficient")

        expect(feed.last[:id]).to eq(activity_session.id)
        expect(feed.last[:completed]).to eq("5 mins ago")
        expect(feed.last[:score]).to eq("Proficient")
      end
    end
  end
end
