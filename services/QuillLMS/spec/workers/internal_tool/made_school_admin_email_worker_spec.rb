# frozen_string_literal: true

require 'rails_helper'

describe InternalTool::MadeSchoolAdminEmailWorker, type: :worker do
  let!(:teacher) { create(:teacher) }
  let!(:school) { create(:school) }
  let!(:mailer_user) { Mailer::User.new(teacher) }
  let!(:mailer_class)  { InternalToolUserMailer }
  let!(:mailer_method) { :made_school_admin_email}
  let!(:worker) { InternalTool::MadeSchoolAdminEmailWorker.new }
  let!(:analytics) { double(:analytics).as_null_object }

  before do
    allow(School).to receive(:find_by).and_return(school)
    allow(mailer_class).to receive(mailer_method).with(mailer_user, school.name).and_return(double(:email, deliver_now!: true))
    allow(teacher).to receive(:mailer_user).and_return(mailer_user)
    allow(SegmentAnalytics).to receive(:new) { analytics }
  end

  describe 'user is nil' do

    before do
      allow(User).to receive(:find_by).and_return(nil)
    end

    it 'should not send the mail with user mailer' do
      expect(mailer_class).not_to receive(mailer_method)
      worker.perform(nil, school.id)
    end

    it 'should not send a segment.io event' do
      expect(analytics).not_to receive(:track_school_admin_user)
      worker.perform(nil, school.id)
    end
  end

  describe 'user is not nil' do

    before do
      allow(User).to receive(:find_by).and_return(teacher)
    end

    it 'should send the mail with user mailer' do
      expect(mailer_class).to receive(mailer_method).with(mailer_user, school.name)
      worker.perform(teacher.id, school.id)
    end

    it 'should send a segment.io event if user or school is nil' do
      expect(analytics).to receive(:track_school_admin_user).with(
        teacher,
        SegmentIo::BackgroundEvents::STAFF_MADE_EXISTING_USER_SCHOOL_ADMIN,
        school.name,
        SegmentIo::Properties::STAFF_USER
      )
      worker.perform(teacher.id, school.id)
    end
  end
end
