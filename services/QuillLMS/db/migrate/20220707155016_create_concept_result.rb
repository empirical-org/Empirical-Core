# frozen_string_literal: true

class CreateConceptResult < ActiveRecord::Migration[5.1]
  def change
    create_table :concept_results do |t|
      t.references :activity_session, type: :int, null: false, index: false
      t.jsonb :answer
      t.integer :attempt_number
      t.references :concept, type: :int, limit: 2, index: false
      t.references :concept_result, type: :int, limit: 8, index: {unique: true}
      t.boolean :correct, null: false
      t.jsonb :extra_metadata
      t.integer :question_number
      t.float :question_score
      t.references :response_directions, type: :int, limit: 4, index: false
      t.references :response_instructions, type: :int, limit: 4, index: false
      t.references :response_previous_feedback, type: :int, limit: 4, index: false
      t.references :response_prompt, type: :int, limit: 4, index: false
      t.references :response_question_type, type: :int, limit: 2, index: false

      t.datetime :created_at, null: false
    end
  end
end
