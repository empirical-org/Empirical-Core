# frozen_string_literal: true

class AddStudentLearningSequenceActivityIndexes < ActiveRecord::Migration[7.1]
  def change
    add_index :student_learning_sequence_activities, [:classroom_unit_id, :activity_id]
    add_index :student_learning_sequence_activities, [:student_learning_sequence_id]
  end
end
