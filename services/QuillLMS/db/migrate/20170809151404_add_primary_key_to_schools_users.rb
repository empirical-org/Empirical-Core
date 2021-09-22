class AddPrimaryKeyToSchoolsUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :schools_users, :id, :primary_key
  end
end
