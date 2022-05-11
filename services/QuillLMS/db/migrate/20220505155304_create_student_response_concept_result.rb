# frozen_string_literal: true

class CreateStudentResponseConceptResult < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_concept_results do |t|
      t.references :concept_result, null: false, foreign_key: true
      t.references :student_response, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
