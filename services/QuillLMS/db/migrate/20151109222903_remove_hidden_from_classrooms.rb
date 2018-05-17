class RemoveHiddenFromClassrooms < ActiveRecord::Migration
  def change
    remove_column :classrooms, :hidden
  end
end
