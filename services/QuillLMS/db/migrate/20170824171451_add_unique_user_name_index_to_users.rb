class AddUniqueUserNameIndexToUsers < ActiveRecord::Migration[4.2]
  def change
    add_index :users, :username, unique: true, name: 'unique_index_users_on_username', where: "id > 1641954 and username IS NOT null AND username <>  '' "
  end
end
