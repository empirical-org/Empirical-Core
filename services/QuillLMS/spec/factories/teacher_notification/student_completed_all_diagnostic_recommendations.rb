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
  factory :teacher_notification_student_completed_all_diagnostic_recommendations, class: 'TeacherNotification::StudentCompletedAllDiagnosticRecommendations' do
    user
    student_name { 'Student Name' }
    classroom_name { 'Classroom Name' }
  end
end
