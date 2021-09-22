class AddGradeToClassroom < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :grade, :string
    add_index :classrooms, :grade
  end
end
