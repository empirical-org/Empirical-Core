class AddVisibleColumnToClassroom < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :visible, :boolean, null: false, default: true
  end
end
