class AddNameToAdminAccount < ActiveRecord::Migration
  def change
    add_column :admin_accounts, :name, :string
  end
end
