# frozen_string_literal: true

class CreateEvidenceResearchGenAiLlmPrompts < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_llm_prompts do |t|
      t.text :prompt, null: false
      t.integer :llm_prompt_template_id, null: false

      t.timestamps
    end
  end
end
