# frozen_string_literal: true

class CreateStudentResponse < ActiveRecord::Migration[5.1]
  def change
    create_table :student_responses do |t|
      t.references :activity_session, null: false, foreign_key: true
      t.integer :attempt_number, null: false
      t.boolean :correct, null: false
      t.references :question, null: false
      t.integer :question_number, null: false
      t.references :student_response_answer_text, null: false, foreign_key: true
      t.references :student_response_directions_text, null: false, foreign_key: true
      t.references :student_response_instructions_text, null: false, foreign_key: true, index: {name: 'idx_student_responses_on_student_response_instructions_text_id'}
      t.references :student_response_prompt_text, null: false, foreign_key: true
      t.references :student_response_question_type, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end
  end
end
