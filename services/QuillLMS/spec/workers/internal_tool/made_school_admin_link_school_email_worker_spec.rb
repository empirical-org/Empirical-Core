# frozen_string_literal: true

require 'rails_helper'

describe InternalTool::MadeSchoolAdminLinkSchoolEmailWorker, type: :worker do
  subject { described_class.new.perform(teacher.id, school.id) }

  let!(:teacher) { create(:teacher) }
  let!(:school) { create(:school) }
  let!(:school_admin) { create(:schools_admins, user: teacher, school: school)}
  let!(:mailer_user) { Mailer::User.new(teacher) }
  let!(:mailer_class)  { InternalToolUserMailer }
  let!(:mailer_method) { :made_school_admin_link_school_email}
  let!(:analytics) { double(:analytics).as_null_object }

  before do
    allow(School).to receive(:find_by).and_return(school)
    allow(mailer_class).to receive(mailer_method).with(mailer_user, school).and_return(double(:email, deliver_now!: true))
    allow(teacher).to receive(:mailer_user).and_return(mailer_user)
    allow(Analytics::SegmentAnalytics).to receive(:new) { analytics }
  end

  describe 'user is nil' do

    before do
      allow(User).to receive(:find_by).and_return(nil)
      allow(SchoolsAdmins).to receive(:where).and_return([])
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
      allow(User).to receive(:find_by).and_return(teacher)
      allow(SchoolsAdmins).to receive(:where).and_return([school_admin])
    end

    it 'should send the mail with user mailer' do
      expect(mailer_class).to receive(mailer_method).with(mailer_user, school)
      subject
    end

    it 'should send a segment.io event if user or school is nil' do
      expect(analytics).to receive(:track_school_admin_user).with(
        teacher,
        Analytics::SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN,
        school.name,
        Analytics::SegmentIo::Properties::STAFF_USER
      )
      subject
    end
  end
end
