# frozen_string_literal: true

class CreateStudentResponseAnswerText < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_answer_texts do |t|
      t.jsonb :answer, null: false, unique: true

      t.datetime :created_at, null: false
    end
  end
end
