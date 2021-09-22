class AddFlagsToUsers < ActiveRecord::Migration[4.2]
  add_column :users, :flags, :string, array: true, default: [], null: false
  add_index :users, :flags
end
