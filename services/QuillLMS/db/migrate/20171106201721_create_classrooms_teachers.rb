class CreateClassroomsTeachers < ActiveRecord::Migration[4.2]
  def change
    create_table :classrooms_teachers do |t|
      t.integer :user_id, index: true, null: false
      t.integer :classroom_id, index: true, null: false
      t.string :role, index: true, null: false
    end
  end
end
