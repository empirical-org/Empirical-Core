class DropSalesAccountsTable < ActiveRecord::Migration
  def up
    drop_table :sales_accounts
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
