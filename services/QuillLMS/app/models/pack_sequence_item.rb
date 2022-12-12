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
class PackSequenceItem < ApplicationRecord
  belongs_to :pack_sequence
  belongs_to :classroom_unit

  has_many :user_pack_sequence_items, dependent: :destroy
  has_many :users, through: :user_pack_sequence_items

  after_save :save_user_pack_sequence_items, if: :saved_change_to_order?

  after_destroy :save_user_pack_sequence_items

  delegate :classroom_id, :unit_id, to: :classroom_unit

  def save_user_pack_sequence_items
    pack_sequence.users.each { |user| SaveUserPackSequenceItemsWorker.perform_async(classroom_id, user.id) }
  end
end
