# frozen_string_literal: true

require 'rails_helper'

describe InternalTool::DistrictAdminAccountCreatedEmailWorker, type: :worker do
  subject { described_class.new.perform(teacher.id, district.id) }

  let!(:teacher) { create(:teacher) }
  let!(:district) { create(:district) }
  let!(:mailer_user) { Mailer::User.new(teacher) }
  let!(:mailer_class)  { InternalToolUserMailer }
  let!(:mailer_method) { :district_admin_account_created_email}
  let!(:analytics) { double(:analytics).as_null_object }

  before do
    allow(District).to receive(:find_by).and_return(district)
    allow(mailer_class).to receive(mailer_method).with(mailer_user, district.name).and_return(double(:email, deliver_now!: true))
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
      expect(analytics).not_to receive(:track_district_admin_user)
      subject
    end
  end

  describe 'user is not nil' do

    before do
      allow(User).to receive(:find_by).and_return(teacher)
    end

    it 'should send the mail with user mailer' do
      expect(mailer_class).to receive(mailer_method).with(mailer_user, district.name)
      subject
    end

    it 'should send a segment.io event' do
      expect(analytics).to receive(:track_district_admin_user).with(
        teacher,
        SegmentIo::BackgroundEvents::STAFF_CREATED_DISTRICT_ADMIN_ACCOUNT,
        district.name,
        SegmentIo::Properties::STAFF_USER
      )
      subject
    end
  end
end
