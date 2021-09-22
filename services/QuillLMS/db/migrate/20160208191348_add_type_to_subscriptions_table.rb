class AddTypeToSubscriptionsTable < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :type, :string
  end
end
