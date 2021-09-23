class AddFlagToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :flag, :string
    add_index :users, :flag
  end
end
