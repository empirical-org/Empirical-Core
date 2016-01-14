class CreateAdminAccounts < ActiveRecord::Migration
  def change
    create_table :admin_accounts do |t|

      t.timestamps
    end
  end
end
