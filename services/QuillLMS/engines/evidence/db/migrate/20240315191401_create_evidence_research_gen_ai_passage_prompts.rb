# frozen_string_literal: true

class CreateEvidenceResearchGenAiPassagePrompts < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passage_prompts do |t|
      t.integer :passage_id, null: false
      t.text :prompt, null: false
      t.text :instructions, null: false
      t.string :conjunction, null: false

      t.timestamps
    end
  end
end
