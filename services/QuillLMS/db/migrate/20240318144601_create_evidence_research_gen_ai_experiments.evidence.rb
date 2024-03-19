# frozen_string_literal: true

# This migration comes from evidence (originally 20240318144447)
class CreateEvidenceResearchGenAiExperiments < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_experiments do |t|
      t.integer :passage_prompt_id, null: false
      t.integer :llm_config_id, null: false
      t.integer :llm_prompt_id, null: false
      t.string :status, null: false
      t.jsonb :results

      t.timestamps
    end
  end
end
