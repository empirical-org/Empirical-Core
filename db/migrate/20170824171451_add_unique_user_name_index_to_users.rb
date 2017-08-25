class AddUniqueUserNameIndexToUsers < ActiveRecord::Migration
  def change
    add_index :users, :username, unique: true, name: 'unique_index_users_on_username', where: "id > 1625425 and username IS NOT null"
  end
end
