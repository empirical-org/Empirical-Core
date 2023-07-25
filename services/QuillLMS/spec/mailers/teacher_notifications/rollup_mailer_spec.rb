# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe RollupMailer, type: :mailer do
    before do
      allow_any_instance_of(ActionView::Helpers::AssetTagHelper).to receive(:stylesheet_link_tag)
    end

    let(:user) { create(:teacher) }
    let(:notifications) {
      [
        create(:teacher_notification_student_completed_all_assigned_activities, user: user)
      ]
    }
    let(:mailer) { described_class.rollup(user, notifications) }
    let(:mail) { mailer.deliver_now }

    it { expect(mail.to).to eq([user.email]) }
    it { expect(mail.from).to eq(['hello@quill.org']) }

    it 'should include the user notification frequency value in the subject line' do
      [TeacherInfo::HOURLY_EMAIL, TeacherInfo::DAILY_EMAIL, TeacherInfo::WEEKLY_EMAIL].each do |frequency|
        user.teacher_info.update(notification_email_frequency: frequency)

        expect(described_class.rollup(user, notifications).deliver_now.subject).to eq("Your Quill #{frequency} roundup")
      end
    end

    it 'should include a description of email frequency in the email' do
      [TeacherInfo::HOURLY_EMAIL, TeacherInfo::DAILY_EMAIL, TeacherInfo::WEEKLY_EMAIL].each do |frequency|
        user.teacher_info.update(notification_email_frequency: frequency)

        expect(described_class.rollup(user, notifications).deliver_now.body.encoded).to match("what happened in the last #{described_class::FREQUENCY_WORD_LOOKUP[frequency]} on Quill:")
      end
    end

    context 'should include the diagnostics section if diagnostic notifications are provided' do
      let(:notifications) { [create(:teacher_notification_student_completed_diagnostic, user: user)] }

      it { expect(mail.body.encoded).to match("View results and recommendations") }
    end

    context 'should include the all assignments section if all assignment notifications are provided' do
      let(:notifications) { [create(:teacher_notification_student_completed_all_assigned_activities, user: user)] }

      it { expect(mail.body.encoded).to match("Assign your students more activities") }
    end

    context 'should include the diagnostic recommendations section if diagnostic recommendation notifications are provided' do
      let(:notifications) { [create(:teacher_notification_student_completed_all_diagnostic_recommendations, user: user)] }

      it { expect(mail.body.encoded).to match("Assign a growth diagnostic") }
    end

    context 'should sort the notification types consistently as defined' do
      # This array is built intentionally in the "wrong" order
      let(:notifications) {
        [
          create(:teacher_notification_student_completed_all_diagnostic_recommendations, user: user),
          create(:teacher_notification_student_completed_diagnostic, user: user),
          create(:teacher_notification_student_completed_all_assigned_activities, user: user)
        ]
      }

      it { expect(mail.body.encoded).to match(/Student completed diagnostic.*Student completed all diagnostic recommendations.*Student completed all assigned activities/m) }
    end

    context 'should not include the diagnostics section if diagnostic notifications are not provided' do
      let(:notifications) { [] }

      it { expect(mail.body.encoded).not_to match("View results and recommendations") }
    end

    context 'should not include the all assignments section if all assignment notifications are not provided' do
      let(:notifications) { [] }

      it { expect(mail.body.encoded).not_to match("Assign your students more activities") }
    end

    context 'should not include the diagnostic recommendations sectiion if diagnostic recommendation notifications are not provided' do
      let(:notifications) { [] }

      it { expect(mail.body.encoded).not_to match("Assign a post-test diagnostic") }
    end

    context 'should include a "and X more" cut-off when there are more than ten notifications of the same type' do
      let(:notifications) {
        11.times.collect do
          create(:teacher_notification_student_completed_all_assigned_activities)
        end
      }

      it { expect(mail.body.encoded).to match("...and #{notifications.length - 10} other student") }

      it 'pluralizes "students" if there are more than 1 truncated student name' do
        notifications.push(create(:teacher_notification_student_completed_all_assigned_activities))

        expect(mail.body.encoded).to match("...and #{notifications.length - 10} other students")
      end
    end
  end
end
