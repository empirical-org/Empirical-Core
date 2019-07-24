class AddIndexesForAdminStuff < ActiveRecord::Migration
  def change
    add_index :admin_accounts_admins, :admin_account_id
    add_index :admin_accounts_admins, :admin_id

    add_index :admin_accounts_teachers, :admin_account_id
    add_index :admin_accounts_teachers, :teacher_id
  end
end
