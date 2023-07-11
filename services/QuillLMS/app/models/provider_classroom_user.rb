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
#  canvas_instance_id    :bigint
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_classroom_users_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_type_and_classroom_id_and_user_id      (type,classroom_external_id,user_external_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
class ProviderClassroomUser < ApplicationRecord
  ACTIVE = :active
  DELETED = :deleted

  TYPES = %w[CleverClassroomUser GoogleClassroomUser].freeze

  belongs_to :canvas_instance, optional: true

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  validates :type, inclusion: { in: TYPES }

  # max_lengths: { clever_id: 24, google_classroom_id: 12 }
  validates :classroom_external_id, length: { maximum: 25 }

  # max_lengths: { clever_id: 24, google_id: 21 }
  validates :user_external_id, length: { maximum: 25 }

  def self.create_list(classroom_external_id, user_external_ids, canvas_instance_id = nil)
    create!(
      user_external_ids.map do |user_external_id|
        {
          classroom_external_id: classroom_external_id,
          user_external_id: user_external_id,
          canvas_instance_id: canvas_instance_id,
          type: name
        }
      end
    )
  end

  def active?
    deleted_at.nil?
  end

  def clever_classroom_id
    raise NotImplementedError
  end

  def clever_user_id
    raise NotImplementedError
  end

  def deleted?
    !active?
  end

  def google_classroom_id
    raise NotImplementedError
  end

  def google_id
    raise NotImplementedError
  end

  def status
    active? ? ACTIVE : DELETED
  end

  def soft_delete
    update!(deleted_at: Time.current)
  end
end
