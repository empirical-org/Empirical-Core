# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id               :bigint           not null, primary key
#  order            :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  pack_sequence_id :bigint
#  unit_id          :bigint
#
# Indexes
#
#  index_pack_sequence_items_on_pack_sequence_id  (pack_sequence_id)
#  index_pack_sequence_items_on_unit_id           (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
class PackSequenceItem < ApplicationRecord
  ID_KEY = 'pack_sequence_item_id'
  ORDER_KEY = 'pack_sequence_item_order'
  STATUS_KEY = 'pack_sequence_item_status'

  STATUSES = [
    LOCKED = 'locked',
    NO_LOCK = 'no lock',
    UNLOCKED = 'unlocked'
  ]

  belongs_to :pack_sequence
  belongs_to :unit

  has_many :user_pack_sequence_items
end
