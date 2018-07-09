class AddClassroomUnitsTable < ActiveRecord::Migration
  def change
    create_table :classroom_units do |t|
      t.references :classroom, index: true, foreign_key: true, null: false
      t.references :unit, index: true, foreign_key: true, null: false
      t.boolean :visible, default: true
      t.integer :assigned_student_ids, array: true, default: []
      t.datetime :due_date

      t.timestamps
    end

    add_index :classroom_units, [:unit_id, :classroom_id], unique: true
  end
end
