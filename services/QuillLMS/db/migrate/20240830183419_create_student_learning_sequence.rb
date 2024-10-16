# frozen_string_literal: true

class CreateStudentLearningSequence < ActiveRecord::Migration[7.0]
  def change
    create_table :student_learning_sequences do |t|
      t.integer :initial_activity_id, null: false
      t.integer :initial_classroom_unit_id, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
