class AddGradeToClassroom < ActiveRecord::Migration
  def change
    add_column :classrooms, :grade, :string
    add_index :classrooms, :grade
  end
end
