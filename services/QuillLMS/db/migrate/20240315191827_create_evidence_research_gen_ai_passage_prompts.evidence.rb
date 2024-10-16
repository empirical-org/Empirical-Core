# frozen_string_literal: true

# This migration comes from evidence (originally 20240315191401)
class CreateEvidenceResearchGenAIPassagePrompts < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passage_prompts do |t|
      t.integer :passage_id, null: false
      t.text :prompt, null: false
      t.text :instructions, null: false
      t.string :conjunction, null: false
      t.text :relevant_passage, null: false

      t.timestamps
    end
  end
end
