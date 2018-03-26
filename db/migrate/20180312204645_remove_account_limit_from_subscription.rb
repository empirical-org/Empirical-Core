class RemoveAccountLimitFromSubscription < ActiveRecord::Migration
  def change
    remove_column :subscriptions, :account_limit, :integer
  end
end
