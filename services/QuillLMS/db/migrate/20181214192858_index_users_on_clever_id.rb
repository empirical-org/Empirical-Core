class IndexUsersOnCleverId < ActiveRecord::Migration[4.2]
  def change
    add_index :users, :clever_id
  end
end
