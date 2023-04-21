# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notification_settings
#
#  id                :bigint           not null, primary key
#  notification_type :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_teacher_notification_settings_on_user_id           (user_id)
#  index_teacher_notification_settings_on_user_id_and_type  (user_id,notification_type) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class TeacherNotificationSetting < ApplicationRecord
  DEFAULT_FOR_NEW_USERS = [
    TeacherNotification::STUDENT_COMPLETED_DIAGNOSTIC,
    TeacherNotification::STUDENT_COMPLETED_ALL_DIAGNOSTIC_RECOMMENDATIONS,
    TeacherNotification::STUDENT_COMPLETED_ALL_ASSIGNED_ACTIVITIES
  ]

  belongs_to :user
  validates :notification_type, presence: true, inclusion: {in: TeacherNotification::NOTIFICATION_TYPES}
end
