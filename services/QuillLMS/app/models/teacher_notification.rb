# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notifications
#
#  id                :bigint           not null, primary key
#  email_sent        :datetime
#  message_attrs     :jsonb
#  notification_type :text             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_teacher_notifications_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class TeacherNotification < ApplicationRecord
  NOTIFICATION_TYPES = [
    STUDENT_COMPLETED_DIAGNOSTIC = 'student-completed-diganostic',
    STUDENT_COMPLETED_ALL_DIAGNOSTIC_RECOMMENDATIONS = 'student-completed-all-diagnostic-recommendations',
    STUDENT_COMPLETED_ALL_ASSIGNED_ACTIVITIES = 'student-completed-all-assigned-activities'
  ]

  NOTIFICATION_TYPE_VALIDATION = {
    STUDENT_COMPLETED_DIAGNOSTIC => [
      :student_name,
      :classroom_name,
      :diagnostic_name
    ],
    STUDENT_COMPLETED_ALL_DIAGNOSTIC_RECOMMENDATIONS => [
      :student_name,
      :classroom_name
    ],
    STUDENT_COMPLETED_ALL_ASSIGNED_ACTIVITIES => [
      :student_name,
      :classroom_name
    ]
  }

  belongs_to :user

  validates :notification_type, presence: true, inclusion: {in: NOTIFICATION_TYPES}
  validate :message_attrs_must_be_hash, :message_attrs_payload_has_required_keys

  private def message_attrs_is_hash?
    message_attrs.is_a?(Hash)
  end

  private def message_attrs_must_be_hash
    return if message_attrs_is_hash?

    errors.add(:message_attrs, "must be a hash")
  end

  private def message_attrs_payload_has_required_keys
    return unless message_attrs_is_hash?

    return if message_attrs.keys.map(&:to_s).to_set == NOTIFICATION_TYPE_VALIDATION[notification_type].map(&:to_s).to_set

    errors.add(:message_attrs, "must have all required keys for its notification_type")
  end
end
