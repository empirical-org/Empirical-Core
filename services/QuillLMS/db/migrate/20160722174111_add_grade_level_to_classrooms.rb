class AddGradeLevelToClassrooms < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :grade_level, :integer
    add_index :classrooms, :grade_level
  end
end
