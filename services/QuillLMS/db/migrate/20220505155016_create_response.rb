# frozen_string_literal: true

class CreateResponse < ActiveRecord::Migration[5.1]
  def change
    create_table :responses do |t|
      t.references :activity_session, null: false, index: false
      t.integer :attempt_number
      t.boolean :correct, null: false
      t.integer :question_number
      t.float :question_score
      t.references :response_answer, index: false
      t.references :response_directions, index: false
      t.references :response_instructions, index: false
      t.references :response_previous_feedback, index: false
      t.references :response_prompt, index: false
      t.references :response_question_type, index: false
      t.json :extra_metadata
      t.references :concept_result, index: {unique: true}

      t.datetime :created_at, null: false
    end
  end
end
