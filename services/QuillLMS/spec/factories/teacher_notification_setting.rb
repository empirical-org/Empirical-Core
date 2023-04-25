# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification_setting, class: TeacherNotificationSetting do
    user
    notification_type { TeacherNotification::STUDENT_COMPLETED_ALL_ASSIGNED_ACTIVITIES }
  end
end
