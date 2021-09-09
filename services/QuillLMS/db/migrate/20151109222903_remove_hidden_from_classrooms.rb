class RemoveHiddenFromClassrooms < ActiveRecord::Migration[4.2]
  def change
    remove_column :classrooms, :hidden
  end
end
