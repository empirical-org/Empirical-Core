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
FactoryBot.define do
  factory :pack_sequence_item do
    sequence(:order) { |n| n }
    pack_sequence
    unit
  end
end
