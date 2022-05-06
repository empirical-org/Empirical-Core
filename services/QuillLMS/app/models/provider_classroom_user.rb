# frozen_string_literal: true

# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  provider_classroom_id :string           not null
#  provider_user_id      :string           not null
#
# Indexes
#
#  index_provider_type_and_classroom_id_and_user_id  (type,provider_classroom_id,provider_user_id) UNIQUE
#
class ProviderClassroomUser < ApplicationRecord
  ACTIVE = :active
  DELETED = :deleted

  TYPES = %w[CleverClassroomUser GoogleClassroomUser].freeze

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  validates :type, inclusion: { in: TYPES }

  # max_lengths: { clever_id: 24, google_classroom_id: 12 }
  validates :provider_classroom_id, length: { maximum: 25 }

  # max_lengths: { clever_id: 24, google_id: 21 }
  validates :provider_user_id, length: { maximum: 25 }

  def self.create_list(provider_classroom_id, provider_user_ids)
    create!(
      provider_user_ids.map do |provider_user_id|
        {
          provider_classroom_id: provider_classroom_id,
          provider_user_id: provider_user_id,
          type: name
        }
      end
    )
  end

  def active?
    deleted_at.nil?
  end

  def deleted?
    !active?
  end

  def status
    active? ? ACTIVE : DELETED
  end

  def soft_delete
    update!(deleted_at: Time.current)
  end
end
