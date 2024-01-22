class AddDeletedAtToClassroomsTeacher < ActiveRecord::Migration[7.0]
  def change
    remove_index :classrooms_teachers, [:user_id, :classroom_id]
    add_column :classrooms_teachers, :deleted_at, :timestamp
    add_index :classrooms_teachers, [:user_id, :classroom_id, :deleted_at], unique: true, name: 'unique_user_class_deleted_at_on_classrooms_teachers'
  end
end
