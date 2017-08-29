class AddUniqueGoogleIdAndEmailIndicesToUsers < ActiveRecord::Migration
  def change
    add_index :users, :email, unique: true, name: 'unique_index_users_on_email', where: "id > 1641954 AND email IS NOT null AND email <>  '' "
    add_index :users, :google_id, unique: true, name: 'unique_index_users_on_google_id', where: "id > 1641954 and google_id IS NOT null AND google_id <> '' "
  end
end
