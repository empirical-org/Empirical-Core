class AddSubscriptionTypeReferenceToSubscriptionsTable < ActiveRecord::Migration
  def change
    add_column :subscriptions, :subscription_type_id, :integer
  end
end
