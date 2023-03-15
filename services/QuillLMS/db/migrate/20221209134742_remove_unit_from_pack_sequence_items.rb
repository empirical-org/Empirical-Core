# frozen_string_literal: true

class RemoveUnitFromPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :pack_sequence_items, to_table: :units

    remove_index :pack_sequence_items, column: [:pack_sequence_id, :unit_id], unique: true

    remove_column :pack_sequence_items, :unit_id, :integer
  end
end
