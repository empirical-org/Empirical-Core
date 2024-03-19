# frozen_string_literal: true

class CreateEvidenceResearchGenAiLlmPromptResponseFeedbacks < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_llm_prompt_response_feedbacks do |t|
      t.integer :passage_prompt_response_id, null: false
      t.text :feedback, null: false
      t.string :label

      t.timestamps
    end
  end
end
