class ChangeTypeColumnSubscriptions < ActiveRecord::Migration[4.2]
  def change
    rename_column :subscriptions, :type, :account_type
  end
end
