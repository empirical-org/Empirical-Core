class AddFlagsToUsers < ActiveRecord::Migration
  add_column :users, :flags, :string, array: true, default: [], null: false
  add_index :users, :flags
end
