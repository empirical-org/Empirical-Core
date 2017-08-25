class AddUniqueGoogleIdAndEmailIndicesToUsers < ActiveRecord::Migration
  def change
    add_index :users, :email, unique: true, name: 'unique_index_users_on_email', where: "id > 1625425 AND email IS NOT null"
    add_index :users, :google_id, unique: true, name: 'unique_index_users_on_google_id', where: "id > 1625425 and google_id IS NOT null"
  end
end
