# frozen_string_literal: true

class CreateStudentActivitySequenceActivity < ActiveRecord::Migration[7.0]
  def change
    create_table :student_activity_sequence_activities do |t|
      t.integer :activity_id, null: false
      t.integer :classroom_unit_id, null: false
      t.integer :student_activity_sequence_id, null: false

      t.integer :activity_session_id, null: true
      t.datetime :completed_at, null: true

      t.timestamps
    end
  end
end
