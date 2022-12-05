# frozen_string_literal: true

require 'rails_helper'

describe InternalToolUserMailer, type: :mailer do
  before do
    allow_any_instance_of(ActionView::Helpers::AssetTagHelper).to receive(:stylesheet_link_tag)
  end

  describe 'admin_account_created_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.admin_account_created_email(user, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill school admin account was created for you.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill school admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.made_school_admin_email(user, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_link_school_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.made_school_admin_link_school_email(user, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_school_admin_change_school_email' do
    let(:user) { build(:user) }
    let(:new_school) { build(:school) }
    let(:existing_school) { build(:school) }
    let(:mail) { described_class.made_school_admin_change_school_email(user, new_school, existing_school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Your account is currently linked to #{existing_school.name}. If you’d prefer to link it to #{new_school.name} instead, you can do so by clicking the link below.")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{new_school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end


  describe 'district_admin_account_created_email' do
    let(:user) { build(:user) }
    let(:district) { build(:district) }
    let(:mail) { described_class.district_admin_account_created_email(user, district.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill district admin account was created for you. As an admin of #{district.name}, you will have district-wide access to teacher accounts and student reports for your district.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill district admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'made_district_admin_email' do
    let(:user) { build(:user) }
    let(:district) { build(:district) }
    let(:mail) { described_class.made_district_admin_email(user, district.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{district.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{district.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

end
