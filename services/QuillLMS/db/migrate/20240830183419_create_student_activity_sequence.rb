class CreateStudentActivitySequence < ActiveRecord::Migration[7.0]
  def change
    create_table :student_activity_sequences do |t|
      t.integer :classroom_id, null: false
      t.integer :initial_activity_id, null: false
      t.integer :initial_classroom_unit_id, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
