# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification_student_completed_all_assigned_activities, class: 'TeacherNotification::StudentCompletedAllAssignedActivities' do
    user
    student_name { 'Student Name' }
    classroom_name { 'Classroom Name' }
  end
end
