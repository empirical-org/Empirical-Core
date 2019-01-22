class IndexUsersOnCleverId < ActiveRecord::Migration
  def change
    add_index :users, :clever_id
  end
end
