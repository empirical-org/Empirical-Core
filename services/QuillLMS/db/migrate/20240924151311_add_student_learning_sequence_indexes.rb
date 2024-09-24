# frozen_string_literal: true

class AddStudentLearningSequenceIndexes < ActiveRecord::Migration[7.1]
  def change
    add_index :student_learning_sequences, [:user_id, :initial_activity_id, :initial_classroom_unit_id], unique: true
  end
end
