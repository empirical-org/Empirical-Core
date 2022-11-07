# frozen_string_literal: true

# == Schema Information
#
# Table name: user_pack_sequence_items
#
#  id                    :bigint           not null, primary key
#  status                :string           default("locked")
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  pack_sequence_item_id :bigint           not null
#  user_id               :bigint           not null
#
# Indexes
#
#  index_user_pack_sequence_items_on_pack_sequence_item_id     (pack_sequence_item_id)
#  index_user_pack_sequence_items_on_user_id                   (user_id)
#  on_user_pack_sequence_items_on_user_and_pack_sequence_item  (user_id,pack_sequence_item_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_item_id => pack_sequence_items.id)
#  fk_rails_...  (user_id => users.id)
#
class UserPackSequenceItem < ApplicationRecord
  STATUSES = [
    LOCKED = 'locked',
    UNLOCKED = 'unlocked'
  ]

  belongs_to :user
  belongs_to :pack_sequence_item

  validates :status, inclusion: { in: STATUSES }
  validates :pack_sequence_item, presence: true
  validates :user, presence: true

  def locked?
    status == LOCKED
  end

  def unlocked?
    status == UNLOCKED
  end
end
