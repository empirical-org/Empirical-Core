require 'rails_helper'

describe "FinishActivityAnalytics" do
  let(:analytics) { FinishActivityAnalytics.new }
  let(:segment_analytics) { SegmentAnalytics.new }
  let(:track_calls) { segment_analytics.backend.track_calls }
  let(:identify_calls) { segment_analytics.backend.identify_calls }

  context 'tracking activity completion' do
    let!(:activity_session) { create(:activity_session) }

    it 'sends an event' do
      analytics.track(activity_session)
      expect(identify_calls.size).to eq(1)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_COMPLETION)
      expect(track_calls[0][:user_id]).to eq(activity_session.classroom_activity.classroom.owner.id)
    end
  end

  context 'tracking activity completion for sessions not associated with a teacher' do
    let(:activity_session) { create(:activity_session,  classroom_activity: nil) }

    it 'does nothing' do
      analytics.track(activity_session)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(0)
    end
  end
end
