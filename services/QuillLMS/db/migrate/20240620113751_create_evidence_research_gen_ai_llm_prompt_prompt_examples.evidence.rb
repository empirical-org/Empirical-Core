# frozen_string_literal: true

# This migration comes from evidence (originally 20240620113244)
class CreateEvidenceResearchGenAILLMPromptPromptExamples < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_llm_prompt_prompt_examples do |t|
      t.integer :llm_prompt_id, null: false
      t.integer :prompt_example_id, null: false

      t.timestamps
    end
  end
end
