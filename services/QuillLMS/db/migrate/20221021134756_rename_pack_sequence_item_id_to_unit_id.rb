# frozen_string_literal: true

class RenamePackSequenceItemIdToUnitId < ActiveRecord::Migration[6.1]
  def change
    rename_column :pack_sequence_items, :item_id, :unit_id
  end
end
