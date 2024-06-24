# frozen_string_literal: true

# This migration comes from evidence (originally 20240619171521)
class CreateEvidenceResearchGenAIGuidelines < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_guidelines do |t|
      t.string :category, null: false
      t.text :text, null: false
      t.integer :stem_vault_id, null: false

      t.timestamps
    end
  end
end
