# frozen_string_literal: true

# This migration comes from evidence (originally 20240925184213)
require 'neighbor'
class CreateLabeledEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :evidence_labeled_entries do |t|
      t.boolean :approved
      t.text :entry, null: false
      t.text :label, null: false
      t.text :label_transformed, null: false
      t.jsonb :metadata
      t.integer :prompt_id, null: false
      t.vector :embedding, limit: 1536, null: false

      t.timestamps
    end

    add_index :evidence_labeled_entries, :prompt_id
    add_index :evidence_labeled_entries, [:prompt_id, :entry], unique: true
  end
end
