require 'spec_helper'

describe SegmentAnalytics, :type => :model do

  let(:analytics) { SegmentAnalytics.new }

  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }

  context 'tracking student account creation by teacher' do
    let(:teacher) { FactoryGirl.create(:teacher) }
    let(:student) { FactoryGirl.create(:student) }

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
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
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

  context 'tracking teacher signin' do
    let(:teacher) { FactoryGirl.create(:teacher) }

    it 'identifies the teacher who signed in' do
      analytics.track_teacher_signin(teacher)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:user_id]).to eq(teacher.id)
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
    end

    it 'sends an event' do
      analytics.track_teacher_signin(teacher)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_SIGNIN)
      expect(track_calls[0][:user_id]).to eq(teacher.id)      
    end
  end
end