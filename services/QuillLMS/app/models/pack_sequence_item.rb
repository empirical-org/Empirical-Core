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
#
# Indexes
#
#  index_pack_sequence_items_on_pack_sequence_id  (pack_sequence_id)
#
# Foreign Keys
#
#  fk_rails_...  (pack_sequence_id => pack_sequences.id)
#
class PackSequenceItem < ApplicationRecord
  belongs_to :pack_sequence
  belongs_to :classroom_unit

  has_many :user_pack_sequence_items, dependent: :destroy

  after_save :save_user_pack_sequence_items, if: :saved_change_to_order?

  delegate :classroom_id, :unit_id, to: :classroom_unit

  def save_user_pack_sequence_items
    user_ids.each { |user_id| SaveUserPackSequenceItemsWorker.perform_async(classroom_id, user_id) }
  end

  private def user_ids
    classroom_unit.assigned_student_ids
  end
end
