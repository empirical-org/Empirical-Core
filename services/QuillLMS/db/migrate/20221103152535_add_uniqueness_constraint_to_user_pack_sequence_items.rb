# frozen_string_literal: true

class AddUniquenessConstraintToUserPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    add_index :user_pack_sequence_items,
      [:user_id, :pack_sequence_item_id],
      name: :index_user_pack_sequence_items__user_id__pack_sequence_item_id,
      unique: true
  end
end
