class AddAccountLimitToSubscriptions < ActiveRecord::Migration
  def change
    add_column :subscriptions, :account_limit, :integer
  end
end
