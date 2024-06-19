# frozen_string_literal: true

# This migration comes from evidence (originally 20240619184956)
class CreateEvidenceResearchGenAIDatasets < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_datasets do |t|
      t.integer :stem_vault_id, null: false
      t.integer :optimal_count, null: false
      t.integer :suboptimal_count, null: false
      t.boolean :locked, null: false

      t.timestamps
    end
  end
end
