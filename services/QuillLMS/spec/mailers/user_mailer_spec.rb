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

  describe 'feedback_history_session_csv_download' do
    it 'should set the subject, receiver and the sender' do
      mail = UserMailer.feedback_history_session_csv_download("team@quill.org", [])

      csv_headers = %w{Date/Time SessionID Conjunction Attempt Optimal? Completed? Response Feedback Rule}

      data = []
      csv = CSV.generate(headers: true) do |csv|
        csv << csv_headers
        data.each do |row|
          csv << [row["datetime"], row["session_uid"], row["conjunction"], row["attempt"], row["optimal"], (row['optimal'] || row['attempt'] == DEFAULT_MAX_ATTEMPTS).to_s, row["response"], row["feedback"], "#{row['feedback_type']}: #{row['name']}"]
        end
      end

      expect(mail.to).to eq(["team@quill.org"])
      expect(mail.subject).to match("Feedback Sessions CSV Download")
      expect(mail.attachments['feedback_sessions.csv'].mime_type).to match('text/csv')
      expect(mail.attachments['feedback_sessions.csv'].body.raw_source).to eq(csv)
    end
  end
end
