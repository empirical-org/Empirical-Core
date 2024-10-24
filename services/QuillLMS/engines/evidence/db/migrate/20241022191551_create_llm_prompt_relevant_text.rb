# frozen_string_literal: true

class CreateLLMPromptRelevantText < ActiveRecord::Migration[7.1]
  def change
    create_table :evidence_research_gen_ai_llm_prompt_relevant_texts do |t|
      t.integer :llm_prompt_id, null: false
      t.integer :relevant_text_id, null: false
      t.timestamps
    end
  end
end
