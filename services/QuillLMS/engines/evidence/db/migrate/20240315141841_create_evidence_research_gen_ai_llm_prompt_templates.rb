# frozen_string_literal: true

class CreateEvidenceResearchGenAILLMPromptTemplates < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_llm_prompt_templates do |t|
      t.text :description, null: false
      t.text :contents, null: false

      t.timestamps
    end
  end
end
