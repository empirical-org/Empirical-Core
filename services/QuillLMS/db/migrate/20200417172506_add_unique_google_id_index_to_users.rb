class AddUniqueGoogleIdIndexToUsers < ActiveRecord::Migration
  def change
    add_index :users, :google_id, unique: true, name: 'unique_index_users_on_google_id', where: "google_id IS NOT null AND google_id != '' AND (role = 'student') "
  end
end