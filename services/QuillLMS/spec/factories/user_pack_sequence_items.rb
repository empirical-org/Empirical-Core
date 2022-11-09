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
FactoryBot.define do
  factory :user_pack_sequence_item do
    pack_sequence_item
    user
    status { UserPackSequenceItem::LOCKED }

    trait(:locked) { status UserPackSequenceItem::LOCKED }
    trait(:unlocked) { status UserPackSequenceItem::UNLOCKED }
  end
end
