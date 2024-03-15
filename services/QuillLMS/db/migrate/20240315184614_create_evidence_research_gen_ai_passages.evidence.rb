# frozen_string_literal: true

# This migration comes from evidence (originally 20240315184312)
class CreateEvidenceResearchGenAiPassages < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passages do |t|
      t.text :full_text, null: false
      t.text :abridged_text, null: false

      t.timestamps
    end
  end
end
