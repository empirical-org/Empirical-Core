class AddFlagToUser < ActiveRecord::Migration
  def change
    add_column :users, :flag, :string
    add_index :users, :flag
  end
end
