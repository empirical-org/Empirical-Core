class AddIdToSchoolsUsers < ActiveRecord::Migration
  def change
    add_column :schools_users, :id, :primary_key
  end
end
