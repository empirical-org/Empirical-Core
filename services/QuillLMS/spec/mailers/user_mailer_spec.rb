# frozen_string_literal: true

require 'rails_helper'

describe UserMailer, type: :mailer do
  before do
    allow_any_instance_of(ActionView::Helpers::AssetTagHelper).to receive(:stylesheet_link_tag)
  end

  describe 'invitation_to_non_existing_user' do
    let(:invitation_hash) { { "inviter_name" => "test", "inviter_email" => "inviter@test.com", "invitee_email" => "invitee@test.com", classroom_names: ["classroom1"] } }
    let(:mail) { described_class.invitation_to_non_existing_user(invitation_hash) }

    it 'should set the subject, reply_to, receiver and the sender' do
      expect(mail.subject).to eq('test has invited you to co-teach on Quill.org!')
      expect(mail.to).to eq(["invitee@test.com"])
      expect(mail.from).to eq(['hello@quill.org'])
      expect(mail.reply_to).to eq(["inviter@test.com"])
    end
  end

  describe 'invitation_to_existing_user' do
    let(:invitation_hash) { { "inviter_name" => "test", "inviter_email" => "inviter@test.com", "invitee_email" => "invitee@test.com", classroom_names: ["classroom1"] } }
    let(:mail) { described_class.invitation_to_existing_user(invitation_hash) }

    it 'should set the subject, reply_to, receiver and the sender' do
      expect(mail.subject).to eq('test has invited you to co-teach on Quill.org!')
      expect(mail.to).to eq(["invitee@test.com"])
      expect(mail.from).to eq(['hello@quill.org'])
      expect(mail.reply_to).to eq(["inviter@test.com"])
    end
  end

  describe 'password_reset_email' do
    let!(:user) { create(:user) }

    it 'should set the subject, receiver and the sender' do
      user.refresh_token!
      mail = described_class.password_reset_email(user)
      expect(mail.subject).to eq("Reset your Quill password")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
    end
  end

  describe 'account_created_email' do
    let(:user) { build(:user) }
    let(:mail) { described_class.account_created_email(user, "test123", "admin") }

    it 'should set the subject, receiver and the sender' do
      expect(mail.subject).to eq("Welcome to Quill, An Administrator Created A Quill Account For You!")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
    end
  end

  describe 'admin_dashboard_teacher_account_created_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:is_reminder_false) { false }
    let(:is_reminder_true) { true }
    let(:mail) { described_class.admin_dashboard_teacher_account_created_email(user, admin_user.name, school.name, is_reminder_false) }
    let(:reminder_mail) { described_class.admin_dashboard_teacher_account_created_email(user, admin_user.name, school.name, is_reminder_true) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill account was created for you by #{admin_user.name} at #{school.name}")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill account was created for you")
      expect(reminder_mail.subject).to eq("🔔 Reminder: #{user.first_name}, a Quill account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_dashboard_admin_account_created_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:is_reminder_false) { false }
    let(:is_reminder_true) { true }
    let(:mail) { described_class.admin_dashboard_admin_account_created_email(user, admin_user.name, school.name, is_reminder_false) }
    let(:reminder_mail) { described_class.admin_dashboard_admin_account_created_email(user, admin_user.name, school.name, is_reminder_true) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill school admin account was created for you by #{admin_user.name} at #{school.name}")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill school admin account was created for you")
      expect(reminder_mail.subject).to eq("🔔 Reminder: #{user.first_name}, a Quill school admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_dashboard_teacher_link_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.admin_dashboard_teacher_link_school_email(user, admin_user.name, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Do you teach at the school #{school.name}? This school now has Quill Premium, and an admin, #{admin_user.name}, has requested an upgrade on your behalf.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, please link your Quill account to #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_dashboard_made_school_admin_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.admin_dashboard_made_school_admin_email(user, admin_user.name, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name} by #{admin_user.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_dashboard_made_school_admin_link_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.admin_dashboard_made_school_admin_link_school_email(user, admin_user.name, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name} by #{admin_user.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'admin_dashboard_made_school_admin_change_school_email' do
    let(:user) { build(:user) }
    let(:admin_user) { build(:user) }
    let(:new_school) { build(:school) }
    let(:existing_school) { build(:school) }
    let(:mail) { described_class.admin_dashboard_made_school_admin_change_school_email(user, admin_user.name, new_school, existing_school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Your account is currently linked to #{existing_school.name}. If you’d prefer to link it to #{new_school.name} instead, you can do so by clicking the link below.")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{new_school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'internal_tool_admin_account_created_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.internal_tool_admin_account_created_email(user, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill school admin account was created for you.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill school admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'internal_tool_made_school_admin_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.internal_tool_made_school_admin_email(user, school.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'internal_tool_made_school_admin_link_school_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.internal_tool_made_school_admin_link_school_email(user, school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{school.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'internal_tool_made_school_admin_change_school_email' do
    let(:user) { build(:user) }
    let(:new_school) { build(:school) }
    let(:existing_school) { build(:school) }
    let(:mail) { described_class.internal_tool_made_school_admin_change_school_email(user, new_school, existing_school) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("Your account is currently linked to #{existing_school.name}. If you’d prefer to link it to #{new_school.name} instead, you can do so by clicking the link below.")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{new_school.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end


  describe 'internal_tool_district_admin_account_created_email' do
    let(:user) { build(:user) }
    let(:district) { build(:district) }
    let(:mail) { described_class.internal_tool_district_admin_account_created_email(user, district.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("A Quill district admin account was created for you. As an admin of #{district.name}, you will have district-wide access to teacher accounts and student reports for your district.")
      expect(mail.subject).to eq("[Action Required] #{user.first_name}, a Quill district admin account was created for you")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'internal_tool_made_district_admin_email' do
    let(:user) { build(:user) }
    let(:district) { build(:district) }
    let(:mail) { described_class.internal_tool_made_district_admin_email(user, district.name) }

    it 'should set the subject, receiver and the sender' do
      body_contains_expected_content = mail.body.include?("You were made a Quill admin for #{district.name}")
      expect(mail.subject).to eq("#{user.first_name}, you are now a Quill admin for #{district.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
      expect(body_contains_expected_content).to eq(true)
    end
  end

  describe 'join_school_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.join_school_email(user, school) }

    it 'should set the subject, receiver and the sender' do
      expect(mail.subject).to eq("#{user.first_name}, you need to link your account to your school")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
    end
  end

  describe 'lesson_plan_email' do
    let(:user) { build(:user) }
    let(:lesson) { build(:lesson_classification) }
    let(:unit) { build(:unit) }
    let(:mail) { described_class.lesson_plan_email(user, [lesson], unit) }

    it 'should set the subject, receiver and the sender' do
      expect(mail.subject).to eq("Next Steps for the Lessons in Your New Activity Pack, #{unit.name}")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
    end
  end

  describe 'new_admin_email' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }
    let(:mail) { described_class.new_admin_email(user, school) }

    it 'should set the subject, receiver and the sender' do
      expect(mail.subject).to eq("#{user.first_name}, you are now an admin on Quill!")
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(["hello@quill.org"])
    end
  end

  describe 'declined_renewal_email' do
    let(:user) { build(:user) }
    let(:mail) { described_class.declined_renewal_email(user) }

    it 'should interpolate team signature from constants object' do
      expect(mail.body.encoded).to include(described_class::CONSTANTS[:signatures][:quill_team])
    end
  end

  describe 'daily_stats_email' do
    let(:date) { Time.current.getlocal('-05:00').yesterday.to_s}
    let(:user) { build(:user) }

    before do
      mock_nps_data = ({
        'nps': 100,
        'respondents': [9, 0, 0]
      }).as_json
      allow_any_instance_of(UserMailer).to receive(:get_satismeter_nps_data).and_return(mock_nps_data)
      allow_any_instance_of(UserMailer).to receive(:get_satismeter_comment_data).and_return([])
      allow_any_instance_of(UserMailer).to receive(:get_intercom_data).and_return({})
    end

    it 'should set the subject, receiver and the sender' do
      mail = UserMailer.daily_stats_email(date)

      expect(mail.to).to eq(["team@quill.org"])
      expect(mail.subject).to match("Quill Daily Analytics")
    end
  end
end
