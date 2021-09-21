class AddUserIdToUnits < ActiveRecord::Migration[4.2]
  def change
    add_column :units, :user_id, :integer
    add_index :units, :user_id
  end
end
