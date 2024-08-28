# frozen_string_literal: true

# This migration comes from evidence (originally 20240828195901)
class CreateEvidenceResearchGenAIDataSlices < ActiveRecord::Migration[7.0]
  create_table :evidence_research_gen_ai_data_slices do |t|
    t.integer :parent_dataset_id, null: false
    t.integer :child_dataset_id, null: false

    t.timestamps
  end
end
