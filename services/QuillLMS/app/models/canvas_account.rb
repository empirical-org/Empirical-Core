# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_accounts
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  external_id        :string           not null
#  user_id            :bigint           not null
#
# Indexes
#
#  index_canvas_accounts_on_canvas_instance_id_and_external_id  (canvas_instance_id,external_id) UNIQUE
#  index_canvas_accounts_on_user_id                             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (user_id => users.id)
#
class CanvasAccount < ApplicationRecord
  class InvalidUserExternalIdFormatError < StandardError; end

  VALID_USER_EXTERNAL_ID_FORMAT = /\A\d+:[a-fA-F0-9]+\z/.freeze

  belongs_to :canvas_instance
  belongs_to :user

  def self.build_user_external_id(canvas_instance_id, external_id)
    [canvas_instance_id, external_id].join(':')
  end

  def self.custom_create_by_user_external_id!(user_external_id, user_id)
    canvas_instance_id, external_id = unpack_user_external_id!(user_external_id)

    create!(canvas_instance_id: canvas_instance_id, external_id: external_id, user_id: user_id)
  end

  def self.custom_find_by_user_external_id(user_external_id)
    return nil unless valid_user_external_id_format?(user_external_id)

    canvas_instance_id, external_id = user_external_id.split(':')

    find_by(canvas_instance_id: canvas_instance_id, external_id: external_id)
  end

  def self.unpack_user_external_id!(user_external_id)
    raise InvalidUserExternalIdFormatError unless valid_user_external_id_format?(user_external_id)

    user_external_id.split(':')
  end

  def self.valid_user_external_id_format?(user_external_id)
    user_external_id&.match?(VALID_USER_EXTERNAL_ID_FORMAT)
  end

  def user_external_id
    self.class.build_user_external_id(canvas_instance_id, external_id)
  end
end
