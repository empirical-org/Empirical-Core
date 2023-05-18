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
    TeacherNotifications::StudentCompletedDiagnostic,
    TeacherNotifications::StudentCompletedAllDiagnosticRecommendations,
    TeacherNotifications::StudentCompletedAllAssignedActivities
  ].map(&:name).freeze

  def self.notification_types
    TeacherNotification.subclasses.map(&:name)
  end

  belongs_to :user
  validates :notification_type,
    presence: true,
    inclusion: {in: ->(model) { model.class.notification_types },
      message: "%<value>s is not a valid TeacherNotification type"}

  def self.rollup_hash
    active_types = pluck(:notification_type).uniq

    notification_types.to_h do |notification_type|
      [notification_type, notification_type.in?(active_types)]
    end
  end
end
