# frozen_string_literal: true

# == Schema Information
#
# Table name: teacher_notifications
#
#  id                :bigint           not null, primary key
#  email_sent        :boolean          default(FALSE)
#  notification_type :text             not null
#  params            :jsonb
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
  validate :params_must_be_hash, :params_payload_has_required_keys

  private def params_is_hash?
    params.is_a?(Hash)
  end

  private def params_must_be_hash
    unless params_is_hash?
      errors.add(:params, "must be a hash")
    end
  end

  private def params_payload_has_required_keys
    return unless params_is_hash?

    unless params.keys.map(&:to_s).to_set == NOTIFICATION_TYPE_VALIDATION[notification_type].map(&:to_s).to_set
      errors.add(:params, "must have all required keys for its notification_type")
    end
  end  
end
