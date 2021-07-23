class AddOrderToClassroomsTeachers < ActiveRecord::Migration[5.0]
  def change
    add_column :classrooms_teachers, :order, :integer, null: true
  end
end
