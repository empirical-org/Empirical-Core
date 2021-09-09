class AddUniqueCleverIdIndexToUsers < ActiveRecord::Migration[4.2]
  def change
    add_index :users, :clever_id, unique: true, name: 'unique_index_users_on_clever_id', where: "clever_id IS NOT null AND clever_id != '' AND (id > 5593155 OR role = 'student') "
  end
end
