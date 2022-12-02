# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mailer::User do
  let(:user) { create(:user) }
  let(:admin_user) { create(:user) }
  let(:school) { create(:school) }
  let(:new_school) { create(:school) }
  let(:existing_school) { create(:school) }
  let(:district) { create(:district) }

  describe '#send_admin_dashboard_teacher_account_created_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:teacher_account_created_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:teacher_account_created_email).with(user.mailer_user, admin_user.name, school.name, true)
      user.mailer_user.send_admin_dashboard_teacher_account_created_email(admin_user.name, school.name, true)
    end
  end

  describe '#send_admin_dashboard_admin_account_created_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:admin_account_created_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:admin_account_created_email).with(user.mailer_user, admin_user.name, school.name, true)
      user.mailer_user.send_admin_dashboard_admin_account_created_email(admin_user.name, school.name, true)
    end
  end

  describe '#send_admin_dashboard_teacher_link_school_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:teacher_link_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:teacher_link_school_email).with(user.mailer_user, admin_user.name, school)
      user.mailer_user.send_admin_dashboard_teacher_link_school_email(admin_user.name, school)
    end
  end

  describe '#send_admin_dashboard_made_school_admin_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:made_school_admin_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:made_school_admin_email).with(user.mailer_user, admin_user.name, school.name)
      user.mailer_user.send_admin_dashboard_made_school_admin_email(admin_user.name, school.name)
    end
  end

  describe '#send_admin_dashboard_made_school_admin_link_school_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:made_school_admin_link_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:made_school_admin_link_school_email).with(user.mailer_user, admin_user.name, school.name)
      user.mailer_user.send_admin_dashboard_made_school_admin_link_school_email(admin_user.name, school.name)
    end
  end

  describe '#send_admin_dashboard_made_school_admin_change_school_email' do

    before do
      allow(AdminDashboardUserMailer).to receive(:made_school_admin_change_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(AdminDashboardUserMailer).to receive(:made_school_admin_change_school_email).with(user.mailer_user, admin_user.name, new_school, existing_school)
      user.mailer_user.send_admin_dashboard_made_school_admin_change_school_email(admin_user.name, new_school, existing_school)
    end
  end

  describe '#send_internal_tool_admin_account_created_email' do

    before do
      allow(InternalToolUserMailer).to receive(:admin_account_created_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:admin_account_created_email).with(user.mailer_user, school.name)
      user.mailer_user.send_internal_tool_admin_account_created_email(school.name)
    end
  end

  describe '#send_internal_tool_made_school_admin_email' do

    before do
      allow(InternalToolUserMailer).to receive(:made_school_admin_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:made_school_admin_email).with(user.mailer_user, school.name)
      user.mailer_user.send_internal_tool_made_school_admin_email(school.name)
    end
  end

  describe '#send_internal_tool_made_school_admin_link_school_email' do

    before do
      allow(InternalToolUserMailer).to receive(:made_school_admin_link_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:made_school_admin_link_school_email).with(user.mailer_user, school.name)
      user.mailer_user.send_internal_tool_made_school_admin_link_school_email(school.name)
    end
  end

  describe '#send_internal_tool_made_school_admin_change_school_email' do

    before do
      allow(InternalToolUserMailer).to receive(:made_school_admin_change_school_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:made_school_admin_change_school_email).with(user.mailer_user, new_school, existing_school)
      user.mailer_user.send_internal_tool_made_school_admin_change_school_email(new_school, existing_school)
    end
  end

  describe '#send_internal_tool_district_admin_account_created_email' do

    before do
      allow(InternalToolUserMailer).to receive(:district_admin_account_created_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:district_admin_account_created_email).with(user.mailer_user, district.name)
      user.mailer_user.send_internal_tool_district_admin_account_created_email(district.name)
    end
  end

  describe '#send_internal_tool_made_district_admin_email' do

    before do
      allow(InternalToolUserMailer).to receive(:made_district_admin_email).and_return(double(:email, deliver_now!: true))
    end

    it 'should send the mail with user mailer' do
      expect(InternalToolUserMailer).to receive(:made_district_admin_email).with(user.mailer_user, district.name)
      user.mailer_user.send_internal_tool_made_district_admin_email(district.name)
    end
  end
end
