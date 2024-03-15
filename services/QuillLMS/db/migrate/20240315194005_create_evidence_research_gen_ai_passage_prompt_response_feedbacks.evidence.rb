# frozen_string_literal: true

# This migration comes from evidence (originally 20240315193912)
class CreateEvidenceResearchGenAiPassagePromptResponseFeedbacks < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_passage_prompt_response_feedbacks do |t|
      t.integer :passage_prompt_id, null: false
      t.string :label
      t.text :feedback, null: false

      t.timestamps
    end
  end
end
