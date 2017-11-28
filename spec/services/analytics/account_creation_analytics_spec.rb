require 'rails_helper'

describe "AccountCreationAnalytics" do

  let(:analytics) { AccountCreationAnalytics.new }
  let(:segment_analytics) { SegmentAnalytics.new }
  let(:track_calls) { segment_analytics.backend.track_calls }
  let(:identify_calls) { segment_analytics.backend.identify_calls }

  context 'tracking teacher account creation' do
    let(:teacher) { create(:teacher) }

    def subject
      analytics.track_teacher(teacher)
    end

    it 'identifies the new user and send an event' do
      subject
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:traits].keys).to include(:premium_state)
    end

    it 'sends an account creation event' do
      subject
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
    end

    def sign_up_for_newsletter(user)
      user.update_attributes(send_newsletter: true)
    end

    context 'teacher signed up for newsletter' do
      it 'sends a signed up for newsletter event' do
        sign_up_for_newsletter(teacher)
        subject
        expect(track_calls[1][:event]).to eq(SegmentIo::Events::TEACHER_SIGNED_UP_FOR_NEWSLETTER)
      end
    end

    context 'teacher did not sign up for newsletter' do
      it 'doesnt send a signed up for newsletter event' do
        subject
        expect(track_calls.size).to eq(1)
      end
    end

  end

  context 'tracking student creating her own account' do
    let(:student) { create(:student) }

    it 'identifies the new user and send an event' do
      analytics.track_student(student)
      expect(identify_calls.size).to eq(1)
      expect(identify_calls[0][:traits].keys).to include(:premium_state)
    end

    it 'sends an event' do
      analytics.track_student(student)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION)
      expect(track_calls[0][:user_id]).to eq(student.id)
    end

  end

end
