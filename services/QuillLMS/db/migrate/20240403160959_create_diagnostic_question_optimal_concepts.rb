# frozen_string_literal: true

class CreateDiagnosticQuestionOptimalConcepts < ActiveRecord::Migration[7.0]
  def change
    create_table :diagnostic_question_optimal_concepts do |t|
      t.string :question_uid, null: false
      t.integer :concept_id, null: false

      t.timestamps
    end

    add_index :diagnostic_question_optimal_concepts, [:question_uid, :concept_id], unique: true, name: 'unique_diagnostic_question_optimal_concepts_uid_id'
  end
end
