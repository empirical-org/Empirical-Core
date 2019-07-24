class AddVisibleColumnToClassroom < ActiveRecord::Migration
  def change
    add_column :classrooms, :visible, :boolean, null: false, default: true
  end
end
