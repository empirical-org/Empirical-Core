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

  describe 'email_verification_email' do
    let!(:user) { create(:user) }
    let!(:user_email_verification) { create(:user_email_verification, user: user, verification_token: 'valid-token')}

    it 'should set the subject, receiver and the sender' do
      mail = described_class.email_verification_email(user)
      expect(mail.subject).to eq("Complete your Quill registration")
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

  describe 'admin verification emails' do
    let(:user) { build(:user) }
    let(:school) { build(:school) }

    describe 'approved_admin_email' do
      let(:mail) { described_class.approved_admin_email(user, school.name) }

      it 'should set the subject, receiver and the sender' do
        expect(mail.subject).to eq("You were approved as an admin of #{school.name}")
        expect(mail.to).to eq([user.email])
        expect(mail.from).to eq(["hello@quill.org"])
      end
    end

    describe 'denied_admin_email' do
      let(:mail) { described_class.denied_admin_email(user, school.name) }

      it 'should set the subject, receiver and the sender' do
        expect(mail.subject).to eq("We couldn’t verify you as an admin of #{school.name}")
        expect(mail.to).to eq([user.email])
        expect(mail.from).to eq(["hello@quill.org"])
      end
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
    # I like to structure specs starting with subject which matches the describe block
    subject { described_class.feedback_history_session_csv_download(email, data) }

    # factor out parameters provided to subject as let variables
    let(:email) { 'team@quill.org' }

    let(:data) do
      [
        {
          "datetime": "20220701",
          "session_uid": "sessionuid",
          "conjunction": "but",
          "attempt": "1",
          "optimal": "false",
          "response": "this is a test response",
          "feedback": "test feedback",
          "feedback_type": "spelling"
        }
      ]
    end

    # Add some constants to UserMailer to make explicit the coupling with the spec:
    let(:csv_headers) { described_class::FEEDBACK_HISTORY_CSV_HEADERS }
    let(:csv_attachment) { subject.attachments[described_class::FEEDBACK_SESSIONS_CSV_FILENAME] }

    it 'should set the subject, receiver and the sender' do
      csv_body = CSV.generate(headers: true) do |csv|
        csv << csv_headers
        data.each do |row|
          #  break up multiple parameter method into multiple lines for readability
          csv << [
            row["datetime"],
            row["session_uid"],
            row["conjunction"],
            row["attempt"],
            row["optimal"],
            row['optimal'] || row['attempt'] == described_class::DEFAULT_MAX_ATTEMPTS,
            row["response"],
            row["feedback"],
            "#{row['feedback_type']}: #{row['name']}"
          ]
        end
      end

      expect(subject.to).to eq [email]

      # Refer to constants to make coupling with string explicit
      expect(subject.subject).to match(described_class::FEEDBACK_SESSIONS_CSV_DOWNLOAD)
      expect(csv_attachment.mime_type).to match('text/csv')
      expect(CSV.parse(csv_attachment.body.raw_source)).to eq(CSV.parse(csv_body))
    end
  end
end
