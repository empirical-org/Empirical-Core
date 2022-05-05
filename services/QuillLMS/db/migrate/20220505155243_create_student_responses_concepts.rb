# frozen_string_literal: true

class CreateStudentResponsesConcepts < ActiveRecord::Migration[5.1]
  def change
    create_table :student_responses_concepts do |t|
      t.references :concept, null: false, foreign_key: true
      t.references :student_response, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
