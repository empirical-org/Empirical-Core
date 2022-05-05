# frozen_string_literal: true

class CreateStudentResponseQuestionType < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_question_types do |t|
      t.text :text, null: false

      t.datetime :created_at, null: false

      t.index :text, unique: true
    end
  end
end
