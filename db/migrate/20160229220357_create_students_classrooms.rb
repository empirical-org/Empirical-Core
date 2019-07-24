class CreateStudentsClassrooms < ActiveRecord::Migration
  def change
    create_table :students_classrooms do |t|
      t.integer :student_id, index: true
      t.integer :classroom_id, index: true
      t.boolean :visible, null: false, default: true
      t.timestamps
    end
  end
end
