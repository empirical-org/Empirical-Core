class CreateAdminAccountsTeachers < ActiveRecord::Migration[4.2]
  def change
    create_table :admin_accounts_teachers do |t|
      t.integer :admin_account_id
      t.integer :teacher_id

      t.timestamps
    end
  end
end
