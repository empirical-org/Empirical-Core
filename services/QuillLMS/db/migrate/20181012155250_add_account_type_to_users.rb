class AddAccountTypeToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :account_type, :string, default: 'unknown'
  end
end
