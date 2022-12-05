# frozen_string_literal: true

require 'rails_helper'

describe AdminDashboardUserMailer, type: :mailer do
  before do
    allow_any_instance_of(ActionView::Helpers::AssetTagHelper).to receive(:stylesheet_link_tag)
  end

  describe 'teacher_account_created_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:is_reminder_false) { false }
    let(:is_reminder_true) { true }
    let(:mail) { described_class.teacher_account_created_email(user, admin_user.name, school.name, is_reminder_false) }
    let(:reminder_mail) { described_class.teacher_account_created_email(user, admin_user.name, school.name, is_reminder_true) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill account was created for you by #{admin_user.name} at #{school.name}")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill account was created for you")
      expect(reminder_mail.subject).to eq("🔔 Reminder: #{user.first_name}, a Quill account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_account_created_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:is_reminder_false) { false }
    let(:is_reminder_true) { true }
    let(:mail) { described_class.admin_account_created_email(user, admin_user.name, school.name, is_reminder_false) }
    let(:reminder_mail) { described_class.admin_account_created_email(user, admin_user.name, school.name, is_reminder_true) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill school admin account was created for you by #{admin_user.name} at #{school.name}")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill school admin account was created for you")
      expect(reminder_mail.subject).to eq("🔔 Reminder: #{user.first_name}, a Quill school admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'teacher_link_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.teacher_link_school_email(user, admin_user.name, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Do you teach at the school #{school.name}? This school now has Quill Premium, and an admin, #{admin_user.name}, has requested an upgrade on your behalf.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, please link your Quill account to #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.made_school_admin_email(user, admin_user.name, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name} by #{admin_user.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_link_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.made_school_admin_link_school_email(user, admin_user.name, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name} by #{admin_user.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_change_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:new_school) { build(:school) }
    let(:existing_school) { build(:school) }
    let(:mail) { described_class.made_school_admin_change_school_email(user, admin_user.name, new_school, existing_school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Your account is currently linked to #{existing_school.name}. If you’d prefer to link it to #{new_school.name} instead, you can do so by clicking the link below.")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{new_school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

end
