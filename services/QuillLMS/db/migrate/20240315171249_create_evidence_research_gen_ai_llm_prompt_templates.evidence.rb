# frozen_string_literal: true

# This migration comes from evidence (originally 20240315141841)
class CreateEvidenceResearchGenAiLlmPromptTemplates < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_llm_prompt_templates do |t|
      t.text :description, null: false
      t.text :contents, null: false

      t.timestamps
    end
  end
end
