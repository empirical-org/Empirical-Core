# frozen_string_literal: true

class RenameActivityPackSequenceActivityPacksToPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    rename_table :activity_pack_sequence_activity_packs, :pack_sequence_items
    rename_column :pack_sequence_items, :activity_pack_id, :item_id
    rename_column :pack_sequence_items, :activity_pack_sequence_id, :pack_sequence_id

    rename_index :pack_sequence_items,
      :index_activity_pack_sequence_activity_packs_on_act_pack_seq_id,
      :index_pack_sequence_items_on_pack_sequence_id
  end
end
