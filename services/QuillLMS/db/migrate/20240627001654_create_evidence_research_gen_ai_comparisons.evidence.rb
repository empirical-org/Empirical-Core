# frozen_string_literal: true

# This migration comes from evidence (originally 20240627001402)
class CreateEvidenceResearchGenAIComparisons < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_comparisons do |t|
      t.integer :dataset_id, null: false

      t.timestamps
    end
  end
end
