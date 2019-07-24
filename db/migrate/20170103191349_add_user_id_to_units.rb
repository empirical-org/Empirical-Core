class AddUserIdToUnits < ActiveRecord::Migration
  def change
    add_column :units, :user_id, :integer
    add_index :units, :user_id
  end
end
