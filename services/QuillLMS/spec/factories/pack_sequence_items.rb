# frozen_string_literal: true

# == Schema Information
#
# Table name: pack_sequence_items
#
#  id                :bigint           not null, primary key
#  order             :integer          not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  classroom_unit_id :bigint           not null
#  pack_sequence_id  :bigint           not null
#
# Indexes
#
#  index_pack_sequence_items__classroom_unit_id__pack_sequence_id  (classroom_unit_id,pack_sequence_id) UNIQUE
#  index_pack_sequence_items_on_classroom_unit_id                  (classroom_unit_id)
#  index_pack_sequence_items_on_pack_sequence_id                   (pack_sequence_id)
#
# Foreign Keys
#
#  fk_rails_...  (classroom_unit_id => classroom_units.id)
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#
FactoryBot.define do
  factory :pack_sequence_item do
    sequence(:order) { |n| n }
    pack_sequence
    classroom_unit
  end
end
