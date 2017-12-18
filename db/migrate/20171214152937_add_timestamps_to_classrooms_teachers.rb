class AddTimestampsToClassroomsTeachers < ActiveRecord::Migration
  def change
    add_column :classrooms_teachers, :created_at, :datetime
    add_column :classrooms_teachers, :updated_at, :datetime
  end
end
