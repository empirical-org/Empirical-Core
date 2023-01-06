# frozen_string_literal: true

class AddUniquenessConstraintToPackSequences < ActiveRecord::Migration[6.1]
  def change
    add_index :pack_sequences, [:classroom_id, :diagnostic_activity_id], unique: true
  end
end
