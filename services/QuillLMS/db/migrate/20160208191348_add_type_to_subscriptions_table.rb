class AddTypeToSubscriptionsTable < ActiveRecord::Migration
  def change
    add_column :subscriptions, :type, :string
  end
end
