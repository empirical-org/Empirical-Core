# frozen_string_literal: true

# This migration comes from evidence (originally 20240318140506)
class CreateEvidenceResearchGenAIPassagePromptResponses < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passage_prompt_responses do |t|
      t.integer :passage_prompt_id, null: false
      t.text :response, null: false

      t.timestamps
    end
  end
end
