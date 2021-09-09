class AddTimestampsToClassroomsTeachers < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms_teachers, :created_at, :datetime
    add_column :classrooms_teachers, :updated_at, :datetime
  end
end
