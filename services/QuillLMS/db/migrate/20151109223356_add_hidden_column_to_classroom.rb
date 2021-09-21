class AddHiddenColumnToClassroom < ActiveRecord::Migration[4.2]
  def change
    add_column :classrooms, :hidden, :boolean, null: false, default: false
  end
end
