class AddIndexToStudentsClassroomsTable < ActiveRecord::Migration
  def change
    add_index :students_classrooms, [:student_id, :classroom_id], unique: true
  end
end
