class AddTemporaryToAssignments < ActiveRecord::Migration
  def change
    add_column :assignments, :temporary, :boolean, null: false, default: false
  end
end
