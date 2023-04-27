# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification_student_completed_all_diagnostic_recommendations, class: 'TeacherNotification::StudentCompletedAllDiagnosticRecommendations' do
    user
    student_name { 'Student Name' }
    classroom_name { 'Classroom Name' }
  end
end
