# frozen_string_literal: true

# This migration comes from evidence (originally 20240808123536)
class CreateEvidenceGEvalScores < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_g_eval_scores do |t|
      t.integer :trial_id, null: false
      t.integer :g_eval_id, null: false
      t.integer :llm_example_id, null: false
      t.integer :score, null: false

      t.timestamps
    end
  end
end
