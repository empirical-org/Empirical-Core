require 'spec_helper'

describe SegmentAnalytics, :type => :model do

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }

  context 'tracking student account creation' do
    let(:student) { FactoryGirl.create(:student) }
    
    it 'identifies the new user and sends an event' do
      analytics.track_student_creation(student)
      expect(identify_calls.size).to eq(1)
      # Has the keys defined by UserSerializer
      expect(identify_calls[0][:traits].keys).to eq([:id, :name, :role, :active, :classcode, :username, :ip_address, :schools])
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(student.id)
      expect(track_calls[0][:properties][:student][:id]).to eq(student.id)
      expect(track_calls[0][:properties][:student]).to_not have_key(:password_digest)
    end
  end

  context 'tracking teacher account creation' do
    let(:teacher) { FactoryGirl.create(:teacher) }

    it 'identifies the new user and send an event' do
      analytics.track_teacher_creation(teacher)
      expect(identify_calls.size).to eq(1)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:teacher][:id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:teacher]).to_not have_key(:password_digest)
    end
  end

  context 'tracking classroom creation' do
    let(:classroom) { FactoryGirl.create(:classroom) }

    it 'sends an event with info about the new classroom' do
      analytics.track_classroom_creation(classroom)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::CLASSROOM_CREATION)
      expect(track_calls[0][:user_id]).to eq(classroom.teacher.id)
      expect(track_calls[0][:properties][:teacher][:id]).to eq(classroom.teacher.id)
      expect(track_calls[0][:properties][:classroom].keys).to eq([:id, :name, :code, :grade])
    end
  end

  context 'teacher signin' do
    it 'identifies the teacher who signed in and sends an event'
  end

  context 'student signin' do
    it 'identifies the student who signed in and sends an event'
  end

  context 'tracking activity assignment' do
    it 'sends an event with info about the teacher, student, and activity'
  end

  context 'tracking activity completion' do
    it 'sends an event with info about the activity and student'
  end
end