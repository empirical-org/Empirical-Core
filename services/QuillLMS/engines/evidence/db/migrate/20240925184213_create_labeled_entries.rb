# frozen_string_literal: true

require 'neighbor'
class CreateLabeledEntries < ActiveRecord::Migration[7.1]
  def change
    create_table :evidence_labeled_entries do |t|
      t.text :entry, null: false
      t.text :label, null: false
      t.text :label_transformed, null: false
      t.jsonb :metadata
      t.integer :prompt_id, null: false
      t.vector :embedding, limit: 1536, null: false

      t.timestamps
    end

    add_index :evidence_labeled_entries, :prompt_id
  end
end
