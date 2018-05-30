class AddRecurringToSubscription < ActiveRecord::Migration
  def change
      add_column :subscriptions, :recurring, :boolean, default: false
      add_index :subscriptions, :recurring
  end
end
