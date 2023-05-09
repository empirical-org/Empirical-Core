# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe SendRollupEmailWorker, type: :worker do
    let(:teacher) { create(:teacher) }
    let!(:new_teacher_notification) { create(:teacher_notification_student_completed_all_assigned_activities, user: teacher) }
    let!(:old_teacher_notification) { create(:teacher_notification_student_completed_all_assigned_activities, user: teacher, email_sent: DateTime.current) }
    let(:rollup_double) { double(deliver_now!: nil) }

    before do
      allow(TeacherNotifications::RollupMailer).to receive(:rollup)
        .and_return(rollup_double)
    end

    it 'should bail early if there are no valid TeacherNotifications' do
      new_teacher_notification.update(email_sent: DateTime.current)

      expect(TeacherNotifications::RollupMailer).not_to receive(:rollup)

      TeacherNotifications::SendRollupEmailWorker.new.perform(teacher.id)
    end

    it 'should instantiate and deliver_now! a mailer' do
      expect(rollup_double).to receive(:deliver_now!)

      TeacherNotifications::SendRollupEmailWorker.new.perform(teacher.id)
    end

    it 'should set email_sent values to all relevant TeacherNotifications' do
      TeacherNotifications::SendRollupEmailWorker.new.perform(teacher.id)

      expect(new_teacher_notification.reload.email_sent).to be
    end

    it 'should only send TeacherNotifications without email_sent values' do
      expect(TeacherNotifications::RollupMailer).to receive(:rollup)
        .with(teacher, [new_teacher_notification])
        .and_return(rollup_double)

      TeacherNotifications::SendRollupEmailWorker.new.perform(teacher.id)
    end
  end
end