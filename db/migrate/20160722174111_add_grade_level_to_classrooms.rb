class AddGradeLevelToClassrooms < ActiveRecord::Migration
  def change
    add_column :classrooms, :grade_level, :integer
    add_index :classrooms, :grade_level
  end
end
