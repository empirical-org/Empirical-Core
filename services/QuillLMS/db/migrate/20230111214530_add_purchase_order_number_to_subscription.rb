class AddPurchaseOrderNumberToSubscription < ActiveRecord::Migration[6.1]
  def change
    add_column :subscriptions, :purchase_order_number, :string
  end
end
