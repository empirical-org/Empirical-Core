# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notifications
#
#  id            :bigint           not null, primary key
#  email_sent    :datetime
#  message_attrs :jsonb
#  type          :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_teacher_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :teacher_notification do
    user

    factory :teacher_notification_student_completed_all_assigned_activities, class: TeacherNotifications::StudentCompletedAllAssignedActivities do
      student_name { 'Student Name' }
      classroom_name { 'Classroom Name' }
    end

    factory :teacher_notification_student_completed_all_diagnostic_recommendations, class: TeacherNotifications::StudentCompletedAllDiagnosticRecommendations do
      student_name { 'Student Name' }
      classroom_name { 'Classroom Name' }
    end

    factory :teacher_notification_student_completed_diagnostic, class: TeacherNotifications::StudentCompletedDiagnostic do
      student_name { 'Student Name' }
      classroom_name { 'Classroom Name' }
      diagnostic_name { 'Diagnostic Name' }
    end
  end
end
