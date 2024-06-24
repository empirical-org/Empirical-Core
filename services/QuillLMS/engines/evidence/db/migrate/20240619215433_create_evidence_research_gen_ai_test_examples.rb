# frozen_string_literal: true

class CreateEvidenceResearchGenAITestExamples < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_test_examples do |t|
      t.integer :dataset_id, null: false
      t.text :student_response, null: false
      t.string :staff_assigned_status, null: false
      t.text :staff_feedback
      t.text :highlight
      t.text :automl_feedback
      t.string :automl_status
      t.string :topic_tag

      t.timestamps
    end
  end
end
