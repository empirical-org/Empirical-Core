# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification do
    user
    notification_type { TeacherNotification::STUDENT_COMPLETED_ALL_ASSIGNED_ACTIVITIES }
    message_attrs {
      {
        student_name: 'Student Name',
        classroom_name: 'Classroom Name'
      }
    }
  end
end
