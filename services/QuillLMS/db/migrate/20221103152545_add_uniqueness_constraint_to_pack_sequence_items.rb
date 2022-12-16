# frozen_string_literal: true

class AddUniquenessConstraintToPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    add_index :pack_sequence_items, [:pack_sequence_id, :unit_id], unique: true
  end
end
