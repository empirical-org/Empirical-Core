# frozen_string_literal: true

class CreateEvidenceResearchGenAiPassagePromptResponseExemplars < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passage_prompt_response_exemplars do |t|
      t.integer :passage_prompt_response_feedback_id, null: false
      t.text :response, null: false

      t.timestamps
    end
  end
end
