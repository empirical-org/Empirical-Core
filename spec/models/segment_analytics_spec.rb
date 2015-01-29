require 'spec_helper'

describe SegmentAnalytics, :type => :model do

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }

  context 'tracking student account creation' do
    let(:student) { FactoryGirl.create(:student) }
    
    it 'identifies the new user' do
      analytics.track_student_creation(student)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:user_id]).to eq(student.id)
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
    end

    it 'sends an event' do
      analytics.track_student_creation(student)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(student.id)
    end
  end

  context 'tracking student account creation by teacher' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:student) { FactoryGirl.create(:student) }

    it 'identifies the new student user' do
      analytics.track_student_creation_by_teacher(teacher, student)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:user_id]).to eq(student.id)
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
    end

    it 'sends an event' do
      analytics.track_student_creation_by_teacher(teacher, student)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION_BY_TEACHER)
    end
  end

  context 'tracking teacher account creation' do
    let(:teacher) { FactoryGirl.create(:teacher) }

    it 'identifies the new user and send an event' do
      analytics.track_teacher_creation(teacher)
      expect(identify_calls.size).to eq(1)
    end

    it 'sends an event' do
      analytics.track_teacher_creation(teacher)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
    end
  end

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
    let(:activity_session) { FactoryGirl.create(:activity_session, state: 'finished') }

    it 'sends an event' do
      analytics.track_activity_completion(activity_session)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_COMPLETION)
      expect(track_calls[0][:user_id]).to eq(activity_session.user.id)
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

  context 'teacher signin' do
    it 'identifies the teacher who signed in and sends an event'
  end

  context 'student signin' do
    it 'identifies the student who signed in and sends an event'
  end
end