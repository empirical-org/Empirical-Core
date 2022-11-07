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
#  index_pack_sequence_items_on_pack_sequence_id              (pack_sequence_id)
#  index_pack_sequence_items_on_pack_sequence_id_and_unit_id  (pack_sequence_id,unit_id) UNIQUE
#  index_pack_sequence_items_on_unit_id                       (unit_id)
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#  fk_rails_...  (unit_id => units.id)
#
class PackSequenceItem < ApplicationRecord
  belongs_to :pack_sequence
  belongs_to :unit

  has_many :user_pack_sequence_items, dependent: :destroy
end
