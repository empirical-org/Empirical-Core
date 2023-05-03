# frozen_string_literal: true

FactoryBot.define do
  factory :teacher_notification_student_completed_diagnostic, class: 'TeacherNotifications::StudentCompletedDiagnostic' do
    user
    student_name { 'Student Name' }
    classroom_name { 'Classroom Name' }
    diagnostic_name { 'Diagnostic Name' }
  end
end
