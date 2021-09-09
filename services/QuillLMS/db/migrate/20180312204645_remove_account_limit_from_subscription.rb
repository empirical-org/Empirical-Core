class RemoveAccountLimitFromSubscription < ActiveRecord::Migration[4.2]
  def change
    remove_column :subscriptions, :account_limit, :integer
  end
end
