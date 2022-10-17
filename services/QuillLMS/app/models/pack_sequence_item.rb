# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id               :bigint           not null, primary key
#  order            :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  item_id          :bigint
#  pack_sequence_id :bigint
#
# Indexes
#
#  index_pack_sequence_items_on_item_id           (item_id)
#  index_pack_sequence_items_on_pack_sequence_id  (pack_sequence_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => units.id)
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
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
  belongs_to :item, class_name: 'Unit'
end
