class AddSubscriptionTypeReferenceToSubscriptionsTable < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :subscription_type_id, :integer
  end
end
