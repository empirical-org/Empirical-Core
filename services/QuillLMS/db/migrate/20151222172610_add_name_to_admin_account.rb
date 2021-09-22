class AddNameToAdminAccount < ActiveRecord::Migration[4.2]
  def change
    add_column :admin_accounts, :name, :string
  end
end
