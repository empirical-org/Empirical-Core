# frozen_string_literal: true

module TeacherNotifications
  class RollupMailer < ActionMailer::Base
    include EmailApiHelper
    include ActionView::Helpers::NumberHelper
  
    FREQUENCY_WORD_LOOKUP = {
      TeacherInfo::HOURLY_EMAIL => 'hour',
      TeacherInfo::DAILY_EMAIL  => 'day',
      TeacherInfo::WEEKLY_EMAIL => 'week'
    }

    default from: "The Quill Team <hello@quill.org>"
  
    def rollup(user, teacher_notifications)
      @user = user
      @frequency = FREQUENCY_WORD_LOOKUP[user.teacher_info.notification_email_frequency]

      @teacher_notifications = teacher_notifications.sort_by(&:student_name)
      @teacher_notifications = @teacher_notifications.group_by(&:classroom_name).transform_values do |inner_group_by|
        inner_group_by.group_by(&:type)
      end

      subject = "Your #{user.teacher_info.notification_email_frequency} event update"
      mail(to: @user.email, subject: subject)
    end
  end
end
