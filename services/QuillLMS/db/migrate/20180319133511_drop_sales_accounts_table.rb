class DropSalesAccountsTable < ActiveRecord::Migration[4.2]
  def up
    drop_table :sales_accounts
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
