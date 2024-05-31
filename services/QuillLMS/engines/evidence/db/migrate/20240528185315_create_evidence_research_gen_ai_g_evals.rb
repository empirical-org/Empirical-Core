# frozen_string_literal: true

class CreateEvidenceResearchGenAIGEvals < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_g_evals do |t|
      t.text :task_introduction, null: false
      t.text :evaluation_criteria, null: false
      t.text :evaluation_steps, null: false
      t.string :metric, null: false
      t.integer :max_score, null: false
      t.boolean :selectable, default: true
      t.jsonb :misc, default: {}
      t.integer :version, null: false

      t.timestamps
    end
  end
end
