require 'rails_helper'

describe "AccountCreationAnalytics" do

  let(:analytics) { AccountCreationAnalytics.new }
  let(:segment_analytics) { SegmentAnalytics.new }
  let(:track_calls) { segment_analytics.backend.track_calls }
  let(:identify_calls) { segment_analytics.backend.identify_calls }

  context 'tracking teacher account creation' do
    let(:teacher) { FactoryGirl.create(:teacher) }

    it 'identifies the new user and send an event' do
      analytics.track_teacher(teacher)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
    end

    it 'sends an event' do
      analytics.track_teacher(teacher)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
    end
  end

  context 'tracking student creating her own account' do
    let(:student) { FactoryGirl.create(:student) }

    it 'identifies the new user and send an event' do
      analytics.track_student(student)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:traits].keys).to include(:id, :name, :role, :active, :username, :email, :created_at)
    end

    it 'sends an event' do
      analytics.track_student(student)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(student.id)
    end

  end

end