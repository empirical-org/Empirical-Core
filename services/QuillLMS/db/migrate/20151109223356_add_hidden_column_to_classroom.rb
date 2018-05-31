class AddHiddenColumnToClassroom < ActiveRecord::Migration
  def change
    add_column :classrooms, :hidden, :boolean, null: false, default: false
  end
end
