# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe EnqueueUsersForRollupEmailWorker, type: :worker do
    # While nil_user and never_user are not directly used in any specs
    # we want them to exist in the db to ensure that they don't trigger
    # jobs for any of the frequency values
    let(:nil_user) { create(:teacher) }
    let(:never_user) { create(:teacher) }
    let(:hourly_user) { create(:teacher) }
    let(:daily_user) { create(:teacher) }
    let(:weekly_user) { create(:teacher) }

    before do
      nil_user.teacher_info.update(notification_email_frequency: nil)
      never_user.teacher_info.update(notification_email_frequency: TeacherInfo::NEVER_EMAIL)
      hourly_user.teacher_info.update(notification_email_frequency: TeacherInfo::HOURLY_EMAIL)
      daily_user.teacher_info.update(notification_email_frequency: TeacherInfo::DAILY_EMAIL)
      weekly_user.teacher_info.update(notification_email_frequency: TeacherInfo::WEEKLY_EMAIL)
    end

    it 'should enqueue hourly users when passed HOURLY' do
      expect(TeacherNotifications::SendRollupEmailWorker).to receive(:perform_async).once.with(hourly_user.id)

      subject.perform(TeacherInfo::HOURLY_EMAIL)
    end

    it 'should enqueue hourly users when passed DAILY' do
      expect(TeacherNotifications::SendRollupEmailWorker).to receive(:perform_async).once.with(daily_user.id)

      subject.perform(TeacherInfo::DAILY_EMAIL)
    end

    it 'should enqueue weekly users when passed WEEKLY' do
      expect(TeacherNotifications::SendRollupEmailWorker).to receive(:perform_async).once.with(weekly_user.id)

      subject.perform(TeacherInfo::WEEKLY_EMAIL)
    end
  end
end
