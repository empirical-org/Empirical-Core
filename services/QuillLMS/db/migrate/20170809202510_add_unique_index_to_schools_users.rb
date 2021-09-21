class AddUniqueIndexToSchoolsUsers < ActiveRecord::Migration[4.2]
  def change
    remove_index :schools_users, :user_id
    add_index :schools_users, :user_id, unique: true
  end
end
