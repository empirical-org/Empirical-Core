# frozen_string_literal: true

class CreateResponse < ActiveRecord::Migration[5.1]
  def change
    create_table :responses do |t|
      t.references :activity_session, null: false, foreign_key: true
      t.integer :attempt_number
      t.boolean :correct, null: false
      t.references :question
      t.integer :question_number
      t.float :question_score
      t.references :response_answer, foreign_key: true
      t.references :response_directions, foreign_key: true
      t.references :response_instructions, foreign_key: true
      t.references :response_previous_feedback, foreign_key: true
      t.references :response_prompt, foreign_key: true
      t.references :response_question_type, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
