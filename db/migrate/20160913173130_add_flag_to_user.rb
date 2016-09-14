class AddFlagToUsersTable < ActiveRecord::Migration
  def change
    add_column :users_tables, :flag, :string
    add_index :users_tables, :flag
  end
end
