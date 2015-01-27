require 'spec_helper'

describe SegmentAnalytics, :type => :model do

  let(:analytics) { SegmentAnalytics.new }

  context 'tracking student account creation' do
    let(:student) { FactoryGirl.create(:student) }

    let(:track_calls) { analytics.backend.track_calls }
    let(:identify_calls) { analytics.backend.identify_calls }

    context 'when the user registered through the home page' do
      it 'identifies the new user and sends an event' do
        analytics.track_student_creation(student)
        expect(identify_calls.size).to eq(1)
        expect(track_calls.size).to eq(1)
        expect(track_calls[0][:user_id]).to eq(student.id)
        expect(track_calls[0][:properties][:student][:id]).to eq(student.id)
        expect(track_calls[0][:properties][:student]).to_not have_key(:password_digest)
      end
    end

    context 'when the student was created by the teacher' do
      it 'identifies the new user and sends an event with info about the teacher' do
      end
    end
  end

  context 'tracking teacher account creation' do
    it 'identifies the new user and send an event'
  end

  context 'teacher signin' do
    it 'identifies the teacher who signed in and sends an event'
  end

  context 'student signin' do
    it 'identifies the student who signed in and sends an event'
  end

  context 'tracking classroom creation' do
    it 'sends an event with info about the new classroom'
  end

  context 'tracking activity assignment' do
    it 'sends an event with info about the teacher, student, and activity'
  end

  context 'tracking activity completion' do
    it 'sends an event with info about the activity and student'
  end
end