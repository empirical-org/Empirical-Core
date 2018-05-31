class CreateAdminAccountsAdmins < ActiveRecord::Migration
  def change
    create_table :admin_accounts_admins do |t|
      t.integer :admin_account_id
      t.integer :admin_id

      t.timestamps
    end
  end
end
