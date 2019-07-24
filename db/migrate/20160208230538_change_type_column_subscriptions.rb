class ChangeTypeColumnSubscriptions < ActiveRecord::Migration
  def change
    rename_column :subscriptions, :type, :account_type
  end
end
