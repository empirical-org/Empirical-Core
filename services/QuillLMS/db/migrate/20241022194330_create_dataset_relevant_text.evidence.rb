# frozen_string_literal: true

# This migration comes from evidence (originally 20241022191503)
class CreateDatasetRelevantText < ActiveRecord::Migration[7.1]
  def change
    create_table :evidence_research_gen_ai_dataset_relevant_texts do |t|
      t.integer :dataset_id, null: false
      t.integer :relevant_text_id, null: false
      t.boolean :default, default: false
      t.timestamps
    end
  end
end
