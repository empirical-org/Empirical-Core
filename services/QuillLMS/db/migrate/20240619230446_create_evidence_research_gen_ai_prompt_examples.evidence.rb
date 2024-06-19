# frozen_string_literal: true

# This migration comes from evidence (originally 20240619224707)
class CreateEvidenceResearchGenAIPromptExamples < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_prompt_examples do |t|
      t.integer :dataset_id, null: false
      t.text :student_response, null: false
      t.string :staff_assigned_status, null: false
      t.text :staff_feedback

      t.timestamps
    end
  end
end
