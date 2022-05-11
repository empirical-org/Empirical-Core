# frozen_string_literal: true

class CreateStudentResponseInstructionsText < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_instructions_texts do |t|
      t.text :text, null: false

      t.datetime :created_at, null: false

      t.index :text, unique: true
    end
  end
end
