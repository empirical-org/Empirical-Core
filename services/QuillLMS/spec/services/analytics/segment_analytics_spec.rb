require 'rails_helper'

describe 'SegmentAnalytics' do

  # TODO : arent tests of these behaviours duplicated in the tests of the Workers?

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }


  context 'tracking classroom creation' do
    let(:classroom) { create(:classroom) }

    it 'sends an event' do
      analytics.track_classroom_creation(classroom)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::CLASSROOM_CREATION)
      expect(track_calls[0][:user_id]).to eq(classroom.owner.id)
    end
  end

  context 'tracking activity assignment' do
    let(:teacher) { create(:teacher) }

    it 'sends an event' do
      analytics.track_activity_pack_assignment(teacher.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
    end
  end

  context '#track' do
    let(:teacher) { create(:teacher) }
    let(:student) { create(:student) }

    it 'never sends events to Salesmachine, even if the user is a teacher' do
      analytics.track(teacher, {})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Salesmachine: false,
        Intercom: true
      })
    end

    it 'does not send events to the Salesmachine integration when user is not a teacher' do
      analytics.track(student, {})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Salesmachine: false,
        Intercom: false
      })
    end
  end
end
