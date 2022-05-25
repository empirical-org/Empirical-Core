# frozen_string_literal: true

class CreateResponse < ActiveRecord::Migration[5.1]
  def change
    create_table :responses do |t|
      t.references :activity_session, null: false
      t.integer :attempt_number
      t.boolean :correct, null: false
      t.references :question
      t.integer :question_number
      t.float :question_score
      t.references :response_answer
      t.references :response_directions
      t.references :response_instructions
      t.references :response_previous_feedback
      t.references :response_prompt
      t.references :response_question_type

      t.datetime :created_at, null: false
    end
  end
end
