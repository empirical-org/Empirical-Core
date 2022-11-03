# frozen_string_literal: true

class AddUniquenessConstraintToUserPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    add_index :user_pack_sequence_items,
      [:user_id, :pack_sequence_item_id],
      name: 'on_user_pack_sequence_items_on_user_and_pack_sequence_item',
      unique: true
  end
end
