# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification_setting do
    user
    notification_type { TeacherNotifications::StudentCompletedAllAssignedActivities }
  end
end
