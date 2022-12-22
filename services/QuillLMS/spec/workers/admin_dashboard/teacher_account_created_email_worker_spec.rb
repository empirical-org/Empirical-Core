# frozen_string_literal: true

require 'rails_helper'

# perform(user_id, admin_user_id, school_id, is_reminder)

describe AdminDashboard::TeacherAccountCreatedEmailWorker, type: :worker do
  subject { described_class.new.perform(teacher.id, referring_admin.id, school.id, is_reminder) }
  let!(:teacher) { create(:teacher) }
  let!(:referring_admin) { create(:teacher) }
  let!(:school) { create(:school) }
  let!(:mailer_user) { Mailer::User.new(teacher) }
  let!(:mailer_class)  { AdminDashboardUserMailer }
  let!(:mailer_method) { :teacher_account_created_email}
  let!(:analytics) { double(:analytics).as_null_object }
  let!(:is_reminder) { false }

  before do
    allow(School).to receive(:find_by).and_return(school)
    allow(mailer_class).to receive(mailer_method).with(mailer_user, referring_admin.name, school.name, is_reminder).and_return(double(:email, deliver_now!: true))
    allow(teacher).to receive(:mailer_user).and_return(mailer_user)
    allow(SegmentAnalytics).to receive(:new) { analytics }
  end

  describe 'user is nil' do

    before do
      allow(User).to receive(:find_by).and_return(nil)
    end

    it 'should not send the mail with user mailer' do
      expect(mailer_class).not_to receive(mailer_method)
      subject
    end

    it 'should not send a segment.io event' do
      expect(analytics).not_to receive(:track_school_admin_user)
      subject
    end
  end

  describe 'user is not nil' do

    before do
      allow(User).to receive(:find_by).and_return(teacher, referring_admin)
    end

    it 'should send the mail with user mailer' do
      expect(mailer_class).to receive(mailer_method).with(mailer_user, referring_admin.name, school.name, is_reminder)
      subject
    end

    it 'should send a segment.io event' do
      expect(analytics).to receive(:track_school_admin_user).with(
        teacher,
        SegmentIo::BackgroundEvents::ADMIN_CREATED_TEACHER_ACCOUNT,
        school.name,
        referring_admin.name
      )
      subject
    end
  end
end
