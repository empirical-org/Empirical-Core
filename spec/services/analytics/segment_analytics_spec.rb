require 'rails_helper'

describe 'SegmentAnalytics' do

  # TODO : arent tests of these behaviours duplicated in the tests of the Workers?

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }


  context 'tracking classroom creation' do
    let(:classroom) { FactoryGirl.create(:classroom) }

    it 'sends an event' do
      analytics.track_classroom_creation(classroom)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::CLASSROOM_CREATION)
      expect(track_calls[0][:user_id]).to eq(classroom.teacher.id)
    end
  end

  context 'tracking activity completion' do
    let!(:classroom) { FactoryGirl.create(:classroom) }
    # This object graph is kind of crazy and doesn't make all that much sense.

    let!(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom) }
    let!(:unit) {FactoryGirl.create(:unit, classroom_activities: [classroom_activity])}

    let!(:activity_session) { FactoryGirl.create(:activity_session,
                                                state: 'finished',
                                                classroom_activity: classroom_activity) }

    it 'sends an event' do
      analytics.track_activity_completion(activity_session)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_COMPLETION)
      expect(track_calls[0][:user_id]).to eq(activity_session.classroom_activity.classroom.teacher.id)
    end
  end

  context 'tracking activity completion for sessions not associated with a teacher' do
    let(:activity_session) { FactoryGirl.create(:activity_session, state: 'finished') }

    it 'does nothing' do
      analytics.track_activity_completion(activity_session)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(0)
    end
  end

  context 'tracking activity assignment' do
    let(:teacher) { FactoryGirl.create(:teacher) }

    it 'sends an event' do
      analytics.track_activity_assignment(teacher)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
    end
  end
end